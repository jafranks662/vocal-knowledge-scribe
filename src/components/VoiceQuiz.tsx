
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Question {
  prompt: string;
  answer: string;
}

const sampleQuestions: Question[] = [
  {
    prompt: 'What is the capital of France?',
    answer: 'Paris',
  },
  {
    prompt: 'Which planet is known as the Red Planet?',
    answer: 'Mars',
  },
];

const VoiceQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      console.error('SpeechRecognition is not supported in this browser');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognitionImpl();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript.trim();
        setRecognizedText(transcript);
        if (result.isFinal) {
          checkAnswer(transcript);
        }
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    recognitionRef.current.start();
    setRecognizedText('');
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const checkAnswer = (text: string) => {
    const correctAnswer = sampleQuestions[currentIndex].answer.toLowerCase();
    if (text.toLowerCase() === correctAnswer) {
      setFeedback('correct');
      speak('Correct! Great job!');
    } else {
      setFeedback('incorrect');
      speak("That's not correct. Let's try again or review the notes.");
    }
  };

  const nextQuestion = () => {
    setFeedback('');
    setRecognizedText('');
    setCurrentIndex((i) => (i + 1) % sampleQuestions.length);
  };

  const repeatQuestion = () => {
    speak(sampleQuestions[currentIndex].prompt);
  };

  useEffect(() => {
    speak(sampleQuestions[currentIndex].prompt);
    stopListening();
  }, [currentIndex]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Voice Quiz</h2>
      <p>{sampleQuestions[currentIndex].prompt}</p>

      <div className="flex items-center gap-2">
        {!isListening ? (
          <Button onClick={startListening}>Start Answer</Button>
        ) : (
          <Button variant="destructive" onClick={stopListening}>
            Stop
          </Button>
        )}
        <span className="text-muted-foreground">{recognizedText}</span>
      </div>

      {feedback === 'correct' && (
        <p className="text-green-600">Correct!</p>
      )}
      {feedback === 'incorrect' && (
        <p className="text-red-600">Incorrect. Try again.</p>
      )}

      {feedback && (
        <div className="flex gap-2">
          <Button onClick={nextQuestion}>Next Question</Button>
          <Button variant="secondary" onClick={repeatQuestion}>
            Repeat Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceQuiz;
