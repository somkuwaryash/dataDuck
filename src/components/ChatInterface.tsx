// src/components/ChatInterface.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiLoader, FiRefreshCcw, FiDownload, FiCopy, FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { queryAI, AIResponse, ChatMessage, getBusinessScenarios, BusinessScenario } from '@/utils/aiUtils';
import { executePythonCode } from '@/utils/pyodideUtils';
import { RAG } from '@/utils/RAG';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';

// Interface for displayed messages in the chat
interface DisplayMessage {
  id: string;
  text: string;
  isUser: boolean;
  code?: string;
  executionResult?: string;
  plot?: string;
}

// Props for the ChatInterface component
interface ChatInterfaceProps {
  onQuerySubmit: (query: string, aiResponse: AIResponse, executionResult: string) => Promise<void>;
  dataFrameInfo: string;
  onNewChat: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onQuerySubmit, dataFrameInfo, onNewChat }) => {
  // State variables
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('general');
  const [isRAGMode, setIsRAGMode] = useState(false);
  const [businessScenariosData, setBusinessScenariosData] = useState<BusinessScenario[]>([]);
  const [selectedExample, setSelectedExample] = useState<ChatMessage | null>(null);
  const [learningProgress, setLearningProgress] = useState(0);
  const [isAddingExample, setIsAddingExample] = useState(false);
  const [newExampleQuery, setNewExampleQuery] = useState('');
  const [newExampleResponse, setNewExampleResponse] = useState('');

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { toast } = useToast();

  // Effect to load business scenarios on component mount
  useEffect(() => {
    const scenarios = getBusinessScenarios();
    setBusinessScenariosData(scenarios);
  }, []);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to update chat history when scenario or RAG mode changes
  useEffect(() => {
    setChatHistory([
      {
        role: 'system',
        content: isRAGMode
          ? 'You are an assistant that answers questions based on the provided documents.'
          : selectedScenario !== 'general'
            ? `You are a data analysis assistant specializing in ${selectedScenario}. Interpret the user's query, generate Python code for analysis, and provide explanations. Here's the current dataset information:\n\n${dataFrameInfo}\n\nUse the 'df' DataFrame for your analysis.`
            : `You are a data analysis assistant. Interpret the user's query, generate Python code for analysis, and provide explanations. Here's the current dataset information:\n\n${dataFrameInfo}\n\nUse the 'df' DataFrame for your analysis.`
      }
    ]);
  }, [dataFrameInfo, selectedScenario, isRAGMode]);

  // Function to scroll chat to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  // Function to handle starting a new chat
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setChatHistory([
      {
        role: 'system',
        content: isRAGMode
          ? 'You are an assistant that answers questions based on the provided documents.'
          : selectedScenario !== 'general'
            ? `You are a data analysis assistant specializing in ${selectedScenario}. Interpret the user's query, generate Python code for analysis, and provide explanations. Here's the current dataset information:\n\n${dataFrameInfo}\n\nUse the 'df' DataFrame for your analysis.`
            : `You are a data analysis assistant. Interpret the user's query, generate Python code for analysis, and provide explanations. Here's the current dataset information:\n\n${dataFrameInfo}\n\nUse the 'df' DataFrame for your analysis.`
      }
    ]);
    onNewChat();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRAGMode, selectedScenario, dataFrameInfo, onNewChat]);

  // Function to handle selecting an example
  const handleExampleSelect = (example: ChatMessage) => {
    setSelectedExample(example);
    console.log('Selected example:', selectedExample);
    setInputValue(example.content);
  };

  // Function to handle adding a new example
  const handleAddExample = () => {
    if (newExampleQuery && newExampleResponse && selectedScenario !== 'general') {
      const newExample: ChatMessage = { role: 'user', content: newExampleQuery };
      const newResponse: ChatMessage = { role: 'assistant', content: newExampleResponse };
      
      setBusinessScenariosData(prevScenarios => 
        prevScenarios.map(scenario => 
          scenario.name === selectedScenario
            ? { ...scenario, examples: [...scenario.examples, newExample, newResponse] }
            : scenario
        )
      );

      setNewExampleQuery('');
      setNewExampleResponse('');
      setIsAddingExample(false);
      toast({
        title: "Example Added",
        description: "Your new example has been added to the selected scenario.",
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      setIsLoading(true);
      const query = inputValue.trim();
      setInputValue('');

      const newUserMessage: DisplayMessage = { id: Date.now().toString(), text: query, isUser: true };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      const updatedChatHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: query }];
      setChatHistory(updatedChatHistory);

      try {
        let aiResponse: AIResponse;
        let executionResult = '';
        let plot = '';

        if (isRAGMode) {
          const ragResponse = await RAG.process(query);
          aiResponse = { text: ragResponse };
        } else {
          aiResponse = await queryAI(updatedChatHistory, selectedScenario);

          if (aiResponse.code) {
            const { output, executionResult: execResult, base64Fig } = await executePythonCode(aiResponse.code);
            console.log('Execution Result:', execResult);
            executionResult = output;
            plot = base64Fig;
          }
        }

        const newAIMessage: DisplayMessage = { 
          id: (Date.now() + 1).toString(), 
          text: aiResponse.text,
          isUser: false,
          code: aiResponse.code,
          executionResult: executionResult,
          plot: plot
        };
        setMessages(prevMessages => [...prevMessages, newAIMessage]);

        setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse.text }]);

        if (!isRAGMode) {
          await onQuerySubmit(query, aiResponse, executionResult);
        }

        // Update learning progress
        setLearningProgress(prev => Math.min(prev + 10, 100));
      } catch (error) {
        console.error('Error processing query:', error);
        const errorMessage: DisplayMessage = { 
          id: (Date.now() + 1).toString(), 
          text: 'Sorry, there was an error processing your request. Please try again.',
          isUser: false 
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
        toast({
          title: "Error",
          description: "Failed to process your request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  // Function to handle exporting plots
  const handleExport = useCallback((message: DisplayMessage) => {
    if (message.plot) {
      const blob = new Blob([atob(message.plot)], { type: 'image/png' });
      saveAs(blob, 'generated_plot.png');
      toast({
        title: "Export Successful",
        description: "The plot has been exported as an image.",
      });
    }
  }, [toast]);

  // Function to handle copying code
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "The code has been copied to your clipboard.",
    });
  }, [toast]);

  // Function to render a single message
  const renderMessage = useCallback((message: DisplayMessage) => {
    return (
      <Card key={message.id} className={`mb-4 ${message.isUser ? 'ml-auto bg-primary-100' : 'mr-auto bg-secondary-100'} max-w-[80%]`}>
        <CardContent className="p-4">
          <div className="flex items-start">
            <Avatar className={`w-8 h-8 mr-3 ${message.isUser ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'} flex justify-center items-center`}>
              {message.isUser ? 'U' : 'AI'}
            </Avatar>
            <div className="flex-grow">
              <div className="mb-2 whitespace-pre-wrap">{message.text}</div>
              {message.code && (
                <div className="mb-2">
                  <div className="text-sm font-semibold mb-1 flex justify-between items-center">
                    <span>Generated Code:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(message.code!)}
                    >
                      <FiCopy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                  <ScrollArea className="w-full max-h-[300px]">
                    <SyntaxHighlighter 
                      language="python" 
                      style={vscDarkPlus} 
                      className="rounded-md text-sm"
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {message.code}
                    </SyntaxHighlighter>
                  </ScrollArea>
                </div>
              )}
              {message.executionResult && (
                <div>
                  <div className="text-sm font-semibold mb-1">Execution Result:</div>
                  <ScrollArea className="w-full max-h-[200px]">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-sm whitespace-pre-wrap break-words">
                      {message.executionResult}
                    </pre>
                  </ScrollArea>
                </div>
              )}
              {message.plot && (
                <div className="mt-2">
                  <div className="text-sm font-semibold mb-1">Generated Plot:</div>
                  <img src={`data:image/png;base64,${message.plot}`} alt="Generated Plot" className="max-w-full h-auto rounded-md" />
                  <Button onClick={() => handleExport(message)} variant="outline" size="sm" className="mt-2">
                    <FiDownload className="mr-2 h-4 w-4" /> Export Plot
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [handleCopyCode, handleExport]);

  // Function to render examples
  const renderExamples = () => {
    const currentScenario = businessScenariosData.find(scenario => scenario.name === selectedScenario);
    if (!currentScenario) return null;

    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="examples">
          <AccordionTrigger>Few-Shot Learning Examples</AccordionTrigger>
          <AccordionContent>
            {currentScenario.examples.map((example, index) => (
              <div key={index} className="mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleSelect(example)}
                  className="w-full text-left"
                >
                  {example.content.substring(0, 50)}...
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingExample(true)}
              className="w-full mt-2"
            >
              <FiPlus className="mr-2" /> Add New Example
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  // Function to render learning progress
  const renderLearningProgress = () => (
    <div className="mt-4">
      <Label>Learning Progress</Label>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${learningProgress}%` }}
        ></div>
      </div>
    </div>
  );

  // Main render function
  return (
    <div className="flex flex-col h-[calc(100vh-18rem)] bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header section */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-t-lg">
        <h2 className="text-xl font-semibold">Chat Interface</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="rag-mode"
              checked={isRAGMode}
              onCheckedChange={setIsRAGMode}
            />
            <Label htmlFor="rag-mode">RAG Mode</Label>
          </div>
          {!isRAGMode && (
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Analysis</SelectItem>
                {businessScenariosData.map((scenario) => (
                  <SelectItem key={scenario.name} value={scenario.name}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={handleNewChat} variant="outline" size="sm">
            <FiRefreshCcw className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-grow">
        {/* Sidebar for examples and learning progress */}
        <div className="w-1/4 p-4 border-r border-gray-200 dark:border-gray-700">
          {renderExamples()}
          {renderLearningProgress()}
        </div>

        {/* Chat area */}
        <div className="w-3/4">
          <ScrollArea className="flex-grow mb-4 p-4 h-[calc(100vh-18rem-120px)]" ref={scrollAreaRef}>
            {messages.map((message) => renderMessage(message))}
          </ScrollArea>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-b-lg">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow"
              placeholder={isRAGMode ? "Ask a question about your documents..." : "Ask a question about your data..."}
              disabled={isLoading}
              ref={inputRef}
            />
            <Button type="submit" disabled={isLoading} className="px-4 py-2">
              {isLoading ? <FiLoader className="animate-spin h-5 w-5" /> : <FiSend className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Dialog for adding new examples */}
      <Dialog open={isAddingExample} onOpenChange={setIsAddingExample}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Example</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-example-query">Example Query</Label>
              <Input
                id="new-example-query"
                value={newExampleQuery}
                onChange={(e) => setNewExampleQuery(e.target.value)}
                placeholder="Enter an example query"
              />
            </div>
            <div>
              <Label htmlFor="new-example-response">Example Response</Label>
              <Input
                id="new-example-response"
                value={newExampleResponse}
                onChange={(e) => setNewExampleResponse(e.target.value)}
                placeholder="Enter an example response"
              />
            </div>
            <Button onClick={handleAddExample}>Add Example</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;