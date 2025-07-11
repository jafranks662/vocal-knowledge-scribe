
import React from 'react';
import { User, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AudioPlayer from './AudioPlayer';
import { useTTS } from '@/hooks/useTTS';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  audioBlob?: Blob;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  useTTS(message.content, message.type);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500' : 'bg-gray-500'
      }`}>
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      
      <Card className={`p-3 max-w-[80%] ${
        isUser 
          ? 'bg-blue-500 text-white ml-auto' 
          : 'bg-muted'
      }`}>
        <div className="space-y-2">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.audioBlob && (
            <AudioPlayer 
              audioBlob={message.audioBlob} 
              className="mt-2"
            />
          )}
        </div>
        <div className={`text-xs mt-2 opacity-70 ${
          isUser ? 'text-blue-100' : 'text-muted-foreground'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;
