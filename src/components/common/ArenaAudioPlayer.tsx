import React, { useState, useEffect, useRef } from 'react';

export const ArenaAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Web Audio Synth procedural loop
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSynthLoop = () => {
    if (synthIntervalRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // High-energy esports futuristic arpeggio loop: E3, G3, A3, B3, D4, E4
      const notes = [164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00];
      let step = 0;

      synthIntervalRef.current = setInterval(() => {
        if (!isPlaying || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = step % 4 === 0 ? 'sawtooth' : 'triangle';
        const freq = notes[step % notes.length];
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);

        step++;
      }, 180);
    } catch {
      // Ignore
    }
  };

  const stopSynthLoop = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  useEffect(() => {
    // Auto-trigger audio on first click anywhere on page
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
        startSynthLoop();
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      stopSynthLoop();
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (isPlaying) {
      startSynthLoop();
    } else {
      stopSynthLoop();
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-4 left-4 z-40 opacity-0 pointer-events-none w-1 h-1 select-none" />
  );
};

export default ArenaAudioPlayer;
