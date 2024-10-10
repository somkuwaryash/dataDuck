'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalysisResult {
  text: string;
  visualization?: {
    type: 'line' | 'bar' | 'pie';
    data: any[];
    xKey: string;
    yKey: string;
    title: string;
  };
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  onQuerySubmit: (query: string) => Promise<AnalysisResult>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onQuerySubmit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      const newUserMessage: ChatMessage = { id: Date.now().toString(), text: inputValue, isUser: true };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await onQuerySubmit(inputValue);
        const newAIMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: response.text, isUser: false };
        setMessages(prevMessages => [...prevMessages, newAIMessage]);
      } catch (error) {
        console.error('Error getting response:', error);
        const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: 'Sorry, there was an error processing your request.', isUser: false };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-18rem)]">
      <ScrollArea className="flex-grow mb-4" ref={scrollAreaRef}>
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                message.isUser
                  ? 'bg-primary-100 dark:bg-primary-900 ml-auto text-primary-900 dark:text-primary-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow"
          placeholder="Ask a question about your data..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <FiLoader className="animate-spin" /> : <FiSend />}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;