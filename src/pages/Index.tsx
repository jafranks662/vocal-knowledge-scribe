
import React from 'react';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ChatWithModes from '@/components/ChatWithModes';
import { useRAG } from '@/hooks/useRAG';
import { useLangChainRAG } from '@/hooks/useLangChainRAG';

const Index = () => {
  const { documentCount } = useRAG();
  const { isInitialized } = useLangChainRAG();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            StudyBot
          </h1>
          <p className="text-muted-foreground">
            Type or Ask Below
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Knowledge Base Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Knowledge Base</h2>
              </div>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>{documentCount}</strong> document chunks available
                </div>
              </div>

              {/* Advanced RAG status */}
              {isInitialized && (
                <div className="p-4 bg-green-50 border-green-200 rounded">
                  <span className="text-green-700 font-medium">LangChain RAG Active</span>
                </div>
              )}
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <ChatWithModes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
