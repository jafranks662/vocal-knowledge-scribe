
import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import { Button } from '@/components/ui/button';

interface ChatWithModesProps {
  useLangChain?: boolean;
  onInitializeRAG?: (apiKey: string) => Promise<void>;
}

const ChatWithModes: React.FC<ChatWithModesProps> = ({ useLangChain = false, onInitializeRAG }) => {
  const [mode, setMode] = useState<'study' | 'quiz'>('study');

  const activeClasses = 'bg-blue-500 text-white';
  const inactiveClasses = 'bg-muted';

  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setMode('study')}
          className={mode === 'study' ? activeClasses : inactiveClasses}
        >
          Study Mode
        </Button>
        <Button
          onClick={() => setMode('quiz')}
          className={mode === 'quiz' ? activeClasses : inactiveClasses}
        >
          Quiz Me
        </Button>
      </div>

      {/* Pass the current mode and LangChain props to the chat window */}
      <ChatWindow 
        mode={mode} 
        useLangChain={useLangChain}
        onInitializeRAG={onInitializeRAG}
      />
    </div>
  );
};

export default ChatWithModes;
