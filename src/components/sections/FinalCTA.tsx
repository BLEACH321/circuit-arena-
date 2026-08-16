import React, { useState } from 'react';
import { Lock, UserPlus } from 'lucide-react';
import { sound } from '../../utils/sound';
import { useArena } from '../../context/ArenaContext';

export const FinalCTA: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { arenaOpen } = useArena();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playClick();
    window.open('https://forms.gle/aajnQAHhmVVrNKBW7', '_blank');
  };

  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playClick();
    if (arenaOpen) {
      window.open('https://client-nine-phi-73.vercel.app/', '_blank');
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
    }
  };

  return (
    <section id="register" className="py-24 px-4 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border-2 border-[#ff6b00] hud-box text-center relative overflow-hidden bg-gradient-to-b from-[#141826] to-[#07080c] shadow-[0_0_50px_rgba(255,107,0,0.3)]">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block px-4 py-1.5 bg-[#07080c] border border-[#ff6b00]/50 text-[#ff6b00] font-mono text-xs tracking-widest uppercase rounded">
              LIMITED SQUAD SLOTS AVAILABLE
            </span>

            <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
              JOIN THE <span className="text-[#ff6b00] text-glow-orange">ARENA</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Assemble your team of 1–4 engineers, gear up for component auctions, build custom circuits under pressure, and defend your design.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6 relative">
              {/* JOIN ARENA (REGISTER TEAM) BUTTON */}
              <button
                onClick={handleRegisterClick}
                className="px-10 py-5 bg-[#ff1a40] text-white font-display font-black text-sm tracking-wider uppercase rounded shadow-[0_0_25px_rgba(255,26,64,0.4)] hover:shadow-[0_0_35px_rgba(255,26,64,0.6)] hover:bg-[#ff4d6d] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <UserPlus className="w-5 h-5 text-white" />
                <span>REGISTER TEAM</span>
              </button>

              {/* ENTER THE ARENA (STAGE APP) BUTTON */}
              <div className="relative group">
                <button
                  onClick={handleLockedClick}
                  onMouseEnter={() => !arenaOpen && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`px-10 py-5 font-display font-black text-sm tracking-wider uppercase rounded shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all flex items-center justify-center gap-2 border-2 ${
                    arenaOpen 
                      ? 'bg-transparent text-white border-[#ff6b00] hover:bg-[#ff6b00]/10 cursor-pointer' 
                      : 'bg-[#121520] border-slate-700 hover:border-[#ff6b00] text-slate-350 hover:text-white cursor-not-allowed'
                  }`}
                >
                  {!arenaOpen && <Lock className="w-5 h-5 text-[#ff6b00] animate-pulse" />}
                  <span>{arenaOpen ? 'ENTER ARENA PLATFORM' : '[ ENTER ARENA ]'}</span>
                </button>

                {/* COMING SOON TOOLTIP */}
                {!arenaOpen && (
                  <div className={`absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-200 pointer-events-none z-50 ${showTooltip ? 'opacity-100 -translate-y-1' : 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-1'}`}>
                    <div className="px-3 py-1.5 bg-[#ff6b00] text-black font-mono font-bold text-xs uppercase rounded shadow-[0_0_15px_rgba(255,107,0,0.8)] whitespace-nowrap flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-black" />
                      <span>COMING SOON</span>
                    </div>
                    <div className="w-2 h-2 bg-[#ff6b00] transform rotate-45 mx-auto -mt-1" />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center gap-6 text-xs font-mono text-slate-400">
              <span>SQUAD SIZE: 1–4</span>
              <span>•</span>
              <span>BUDGET: 2000 PTS</span>
              <span>•</span>
              <span>PASSKEY: ARENA2026</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
