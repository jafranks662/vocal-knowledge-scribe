import { useEffect } from 'react'
import { speak } from '@/lib/voice'

const KEY = 'tts-enabled'

export function useTTS(text: string, role: 'user' | 'assistant') {
  useEffect(() => {
    const enabled = localStorage.getItem(KEY) === 'true'
    if (role === 'assistant' && enabled && text) speak(text)
  }, [text, role])
}

export function useTTSToggle() {
  const get = () => localStorage.getItem(KEY) === 'true'
  const set = (val: boolean) => localStorage.setItem(KEY, String(val))
  return { get, set }
}
