
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import VoiceRecorder from '@/components/VoiceRecorder';
import ChatMessage, { Message } from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import { useRAG } from '@/hooks/useRAG';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { generateResponse, documentCount } = useRAG();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: 'Hello! I\'m your voice-enabled RAG chatbot. Ask questions via text or voice and I\'ll answer using the administrator-provided knowledge base.',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

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
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await generateResponse(content);
      
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
    // In a real implementation, you'd convert speech to text here
    // For now, we'll simulate with a placeholder
    const transcribedText = "This is a simulated transcription of your voice message. In a real implementation, this would use speech-to-text technology.";
    handleSendMessage(transcribedText, audioBlob);
  };

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
          <div className="lg:col-span-1">
            <Card className="p-6 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Knowledge Base</h2>
              </div>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>{documentCount}</strong> document chunks available
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <Card className="h-[70vh] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Chat</h2>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
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
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
