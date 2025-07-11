
import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import { Button } from '@/components/ui/button';

interface ChatWithModesProps {}

const ChatWithModes: React.FC<ChatWithModesProps> = () => {
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

      {/* Pass the current mode to the chat window */}
      <ChatWindow
        mode={mode}
      />
    </div>
  );
};

export default ChatWithModes;
