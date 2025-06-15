
import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioBlob: Blob;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBlob, className }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  React.useEffect(() => {
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        className="hidden"
      />
      <Button
        onClick={togglePlayback}
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
      >
        {isPlaying ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>
      <Volume2 className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 h-1 bg-muted rounded-full">
        <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default AudioPlayer;
