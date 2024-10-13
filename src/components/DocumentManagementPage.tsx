'use client';

import React, { useState, useCallback } from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentProcessing from '@/components/DocumentProcessing';
import DocumentList from '@/components/DocumentList';
import ChatInterface from '@/components/ChatInterface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AIResponse } from '@/utils/aiUtils';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  hasEmbedding: boolean;
}

const DocumentManagementPage: React.FC = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [dataFrameInfo] = useState<string>('');

  const handleUploadSuccess = (documents: Omit<UploadedDocument, 'hasEmbedding'>[]) => {
    const docsWithEmbeddingStatus = documents.map(doc => ({
      ...doc,
      hasEmbedding: false
    }));
    setUploadedDocuments(prevDocs => [...prevDocs, ...docsWithEmbeddingStatus]);
  };

  const handleProcessingComplete = () => {
    setUploadedDocuments(prevDocs => 
      prevDocs.map(doc => ({ ...doc, hasEmbedding: true }))
    );
  };

  const handleNewChat = useCallback(() => {
    console.log('Starting a new chat');
  }, []);

  const handleQuerySubmit = useCallback(async (query: string, aiResponse: AIResponse, executionResult: string) => {
    console.log('Query submitted:', query);
    console.log('AI Response:', aiResponse);
    console.log('Execution Result:', executionResult);
  }, []);

//   const updateDataFrameInfo = (info: string) => {
//     setDataFrameInfo(info);
//   };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Management</h1>
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="list">Document List</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card>
            <CardContent>
              <DocumentUpload onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="process">
          <Card>
            <CardContent>
              <DocumentProcessing 
                documents={uploadedDocuments}
                onProcessingComplete={handleProcessingComplete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <CardContent>
              <DocumentList documents={uploadedDocuments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          <Card>
            <CardContent>
              <ChatInterface 
                onNewChat={handleNewChat}
                onQuerySubmit={handleQuerySubmit}
                dataFrameInfo={dataFrameInfo}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagementPage;