import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { studyNotes } from '@/data/studyNotes';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const StudyMode: React.FC = () => {
  const [step, setStep] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [understood, setUnderstood] = useState(false);

  const note = studyNotes[step];

  useEffect(() => {
    setAiResponse(null);
    setUnderstood(false);
    if (!note) return;
    const utterance = new SpeechSynthesisUtterance(note.content);
    speechSynthesis.speak(utterance);
  }, [step, note]);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (text.includes('explain differently')) handleExplain();
      if (text.includes('give me an analogy')) handleAnalogy();
      if (text.includes('next')) handleNext();
    };
    recognition.start();
    return () => recognition.stop();
  }, [note]);

  const callOpenAI = async (prompt: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) return 'OpenAI API key not configured.';
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  };

  const handleExplain = async () => {
    if (!note) return;
    const prompt = `Rephrase or simplify the following explanation:\n\n${note.content}`;
    const result = await callOpenAI(prompt);
    setAiResponse(result);
    speechSynthesis.speak(new SpeechSynthesisUtterance(result));
  };

  const handleAnalogy = async () => {
    if (!note) return;
    const prompt = `Provide an analogy to help a student understand: ${note.content}`;
    const result = await callOpenAI(prompt);
    setAiResponse(result);
    speechSynthesis.speak(new SpeechSynthesisUtterance(result));
  };

  const handleNext = () => {
    if (step < studyNotes.length - 1 && understood) {
      setStep((s) => s + 1);
    }
  };

  if (!note) return <div className="p-4">All notes completed!</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Step {step + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{note.content}</p>
          {aiResponse && <div className="p-3 bg-muted rounded">{aiResponse}</div>}
          <div className="mt-4">
            <p className="font-semibold">Check for understanding:</p>
            <p>{note.question}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button onClick={handleExplain}>Explain differently</Button>
            <Button variant="secondary" onClick={handleAnalogy}>
              Give me an analogy
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setUnderstood(true)}>
              I understand
            </Button>
            <Button onClick={handleNext} disabled={!understood}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudyMode;
