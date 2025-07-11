import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import { Button } from '@/components/ui/button';

/**
 * Wrapper component that renders mode selection buttons and the chat window.
 */
const ChatWithModes: React.FC = () => {
  // Track whether the user is in study or quiz mode. Defaults to "study".
  const [mode, setMode] = useState<'study' | 'quiz'>('study');

  // Styles applied to the active mode button for visual indication.
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
      <ChatWindow mode={mode} />
    </div>
  );
};

export default ChatWithModes;
