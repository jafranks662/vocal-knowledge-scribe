
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
  isDisabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isDisabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    // Check for microphone permission on component mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const SpeechRecognitionImpl =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionImpl) {
        recognitionRef.current = new SpeechRecognitionImpl();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;
        transcriptRef.current = '';
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[event.resultIndex];
          const transcript = result[0].transcript;
          if (result.isFinal) transcriptRef.current += `${transcript} `;
        };
        recognitionRef.current.start();
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav'
        });
        recognitionRef.current?.stop();
        const transcript = transcriptRef.current.trim();
        onRecordingComplete(audioBlob, transcript);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  };

  if (hasPermission === false) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MicOff className="h-4 w-4" />
        <span>Microphone access denied</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          disabled={isDisabled}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Mic className="h-4 w-4 mr-1" />
          Record
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          size="sm"
          variant="destructive"
          className="animate-pulse"
        >
          <Square className="h-4 w-4 mr-1" />
          Stop Recording
        </Button>
      )}
      {isRecording && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Recording...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
