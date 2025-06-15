
import React from 'react';
import { Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>
      
      <Card className="p-3 bg-muted">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
        </div>
      </Card>
    </div>
  );
};

export default TypingIndicator;
