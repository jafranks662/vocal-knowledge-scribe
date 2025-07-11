export interface SpeakOpts {
  voiceName?: string;
  rate?: number;   // default 1
  pitch?: number;  // default 1
  volume?: number; // default 1
}

function pickVoice(name?: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => v.name === name) ||
    voices.find(v => /Google/.test(v.name)) ||
    voices[0]
  );
}

import { toast } from '@/hooks/use-toast';

export function speak(text: string, opts: SpeakOpts = {}) {
  if (!('speechSynthesis' in window)) return;

  const voicesReady = window.speechSynthesis.getVoices().length;
  if (!voicesReady) {
    window.speechSynthesis.addEventListener('voiceschanged', () =>
      speak(text, opts)
    );
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const voice = pickVoice(opts.voiceName);
    const { rate = 1, pitch = 1, volume = 1 } = opts;

    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    const chunks: string[] = [];
    let current = '';
    for (const sentence of sentences) {
      if ((current + sentence).length > 200) {
        if (current.trim()) chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());

    for (const chunk of chunks) {
      const utterance = new SpeechSynthesisUtterance(chunk);
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.error('TTS error', err);
    toast({ description: 'Text-to-speech unavailable on this device.' });
  }
}
