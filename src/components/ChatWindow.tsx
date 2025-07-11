
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import VoiceRecorder from '@/components/VoiceRecorder';
import ChatMessage, { Message } from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import { useLangChainRAG } from '@/hooks/useLangChainRAG';
import { useRAG } from '@/hooks/useRAG';
import { toast } from '@/hooks/use-toast';
import { useTTSToggle } from '@/hooks/useTTS';
import { STUDY_MODE_PROMPT, QUIZ_MODE_PROMPT } from '@/data/systemPrompts';

interface ChatWindowProps {
  mode: 'study' | 'quiz';
}

const ChatWindow: React.FC<ChatWindowProps> = ({ mode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { get: getTTS, set: setTTS } = useTTSToggle();

// Add-system-prompts-for-study-and-quiz-modes
  const { generateResponse } = useRAG();
  const systemPrompt = mode === 'study' ? STUDY_MODE_PROMPT : QUIZ_MODE_PROMPT;
  // Use LangChain RAG as primary, fallback to simple RAG
  const { generateResponse: generateSimpleResponse } = useRAG();
  const {
    generateResponse: generateLangChainResponse,
    isInitialized: isLangChainInitialized
  } = useLangChainRAG();
main

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Mode-specific welcome message
    const ragStatus = isLangChainInitialized 
      ? ' (Advanced RAG active)' 
      : ' (Initialize advanced RAG for enhanced features)';
      
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: mode === 'study' 
        ? `I'm here to help you study! Ask me questions about the course material.${ragStatus}`
        : `Quiz mode activated! I'll ask you questions to test your knowledge.${ragStatus}`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [mode, isLangChainInitialized]);

  const handleSendMessage = async (content: string, audioBlob?: Blob) => {
    if (!content.trim() && !audioBlob) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim() || '[Voice message]',
      audioBlob,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
// codex/add-system-prompts-for-study-and-quiz-modes
      const response = await generateResponse(content, systemPrompt);
      // Use LangChain RAG if initialized, otherwise fall back to simple RAG
      const response = isLangChainInitialized
        ? await generateLangChainResponse(content)
        : await generateSimpleResponse(content);
main
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    const transcribedText = "This is a simulated transcription of your voice message.";
    handleSendMessage(transcribedText, audioBlob);
  };


  return (
    <Card className="h-[70vh] flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {mode === 'study' ? 'Study Chat' : 'Quiz Mode'}
            {isLangChainInitialized && <span className="text-xs ml-2 opacity-75">(Advanced RAG)</span>}
          </h2>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message or use voice..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              className="resize-none"
            />
          </div>
          
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecording}
            isDisabled={isTyping}
          />
          
          <Button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send
          <label className="flex items-center gap-2 justify-center mt-2">
            <input
              type="checkbox"
              defaultChecked={getTTS()}
              onChange={e => setTTS(e.target.checked)}
            />
            🔈 Read answers aloud
          </label>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
