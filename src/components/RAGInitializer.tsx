
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Key, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RAGInitializerProps {
  onInitialize: (apiKey: string) => Promise<void>;
  isInitialized: boolean;
}

const RAGInitializer: React.FC<RAGInitializerProps> = ({ onInitialize, isInitialized }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialize = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to enable advanced RAG features.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onInitialize(apiKey);
      toast({
        title: "Success",
        description: "LangChain RAG system initialized successfully!",
      });
    } catch (error) {
      toast({
        title: "Initialization Failed",
        description: error instanceof Error ? error.message : "Failed to initialize RAG system",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialized) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">LangChain RAG Active</span>
        </div>
        <p className="text-sm text-green-600 mt-1">
          Advanced retrieval and generation enabled
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-orange-200 bg-orange-50">
      <div className="flex items-center gap-2 mb-3">
        <Key className="h-5 w-5 text-orange-600" />
        <h3 className="font-medium text-orange-800">Initialize LangChain RAG</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-700">
            Enter your OpenAI API key to enable advanced RAG capabilities with better embeddings and retrieval.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleInitialize}
            disabled={isLoading || !apiKey.trim()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Initializing...' : 'Initialize'}
          </Button>
        </div>
        
        <p className="text-xs text-orange-600">
          Your API key is stored locally and used only for this session.
        </p>
      </div>
    </Card>
  );
};

export default RAGInitializer;
