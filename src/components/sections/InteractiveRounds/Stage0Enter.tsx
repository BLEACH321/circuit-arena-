import React from 'react';
import { Lock, Clock, Sparkles, Calendar } from 'lucide-react';
import { useArena } from '../../../context/ArenaContext';

export const Stage0Enter: React.FC = () => {
  const { countdownTarget } = useArena();

  const formatDate = (ts: string | number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 text-left font-mono">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest">[ STAGE 0 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            ENTER THE ARENA
          </h3>
          <p className="text-xs font-mono text-[#ff6b00] tracking-widest mt-1">
            SQUAD ENROLLMENT • ARENA PROTOCOL
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#07080c] border border-[#ff6b00]/60 rounded text-[#ff6b00] text-xs font-bold">
          <Lock className="w-4 h-4 text-[#ff6b00] animate-pulse" />
          <span>LOCKED — COMING SOON</span>
        </div>
      </div>

      {/* LOCKED COMING SOON ARENA ENTRY PANEL */}
      <div className="glass-panel p-8 sm:p-14 rounded-2xl border-2 border-[#ff6b00]/60 hud-box bg-gradient-to-b from-[#121624] to-[#07080c] text-center space-y-6 shadow-[0_0_40px_rgba(255,107,0,0.25)] relative overflow-hidden">
        
        {/* Holographic background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon Badge */}
        <div className="w-20 h-20 bg-[#07080c] border-2 border-[#ff6b00] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,107,0,0.4)] animate-pulse relative z-10">
          <Lock className="w-10 h-10 text-[#ff6b00]" />
        </div>

        {/* Title */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07080c] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-bold uppercase rounded">
            <Sparkles className="w-3.5 h-3.5 text-[#ffb700] animate-spin" />
            OFFICIAL ARENA PROTOCOL
          </div>

          <h4 className="text-3xl sm:text-4xl font-black font-display text-white uppercase tracking-wider">
            ARENA ENTRY PROTOCOL <span className="text-[#ff6b00] text-glow-orange">LOCKED</span>
          </h4>
        </div>

        {/* Notice Message */}
        <p className="text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto leading-relaxed relative z-10">
          This Stage 0 Arena Protocol will be officially unlocked and revealed live on the day of the event (<strong className="text-[#00f0ff]">{formatDate(countdownTarget)}</strong>). Squads registered via the official registration portal will receive their live check-in credentials upon unlock.
        </p>

        {/* Event Reveal Date Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#07080c] border border-slate-800 rounded-xl text-xs relative z-10">
          <Calendar className="w-4 h-4 text-[#00ff66]" />
          <span className="text-slate-400">REVEALS ON EVENT DAY:</span>
          <span className="text-[#00ff66] font-bold font-display text-sm">{formatDate(countdownTarget)}</span>
        </div>

        {/* Countdown Status */}
        <div className="pt-4 border-t border-slate-800/80 max-w-md mx-auto flex items-center justify-center gap-2 text-slate-400 text-xs relative z-10">
          <Clock className="w-4 h-4 text-[#ffb700] animate-pulse" />
          <span>ARENA COUNTDOWN RUNNING • PREPARE YOUR SQUAD</span>
        </div>

      </div>

    </div>
  );
};
