import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useArena } from '../../context/ArenaContext';

export const EventCountdown: React.FC = () => {
  const { countdownTarget } = useArena();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(countdownTarget).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  return (
    <section className="py-16 px-4 relative z-10">
      <div className="max-w-5xl mx-auto glass-panel p-8 sm:p-10 rounded-2xl border border-[#ff6b00]/40 hud-box bg-gradient-to-r from-[#0d1019] via-[#07080c] to-[#0d1019] text-center shadow-[0_0_40px_rgba(255,107,0,0.15)]">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07080c] border border-[#ff6b00]/30 text-[#ff6b00] font-mono text-xs tracking-widest uppercase rounded mb-4">
          <Timer className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          ARENA OPENS IN
        </div>

        <h3 className="text-2xl sm:text-4xl font-black font-display text-white uppercase tracking-wider mb-8">
          COUNTDOWN TO <span className="text-[#ff6b00] text-glow-orange">STAGE 0 BRIEFING</span>
        </h3>

        {/* 4 HUD Countdown Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-[#07080c] p-4 rounded-xl border border-slate-800 hud-box">
            <span className="text-3xl sm:text-5xl font-black font-display text-white block">
              {timeLeft.days.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">DAYS</span>
          </div>

          <div className="bg-[#07080c] p-4 rounded-xl border border-slate-800 hud-box">
            <span className="text-3xl sm:text-5xl font-black font-display text-[#ff6b00] text-glow-orange block">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">HOURS</span>
          </div>

          <div className="bg-[#07080c] p-4 rounded-xl border border-slate-800 hud-box">
            <span className="text-3xl sm:text-5xl font-black font-display text-[#00f0ff] text-glow-cyan block">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">MINUTES</span>
          </div>

          <div className="bg-[#07080c] p-4 rounded-xl border border-slate-800 hud-box">
            <span className="text-3xl sm:text-5xl font-black font-display text-[#00ff66] text-glow-green block">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">SECONDS</span>
          </div>

        </div>

      </div>
    </section>
  );
};
