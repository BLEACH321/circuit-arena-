import React from 'react';
import { Trophy } from 'lucide-react';
import { useArena } from '../../../context/ArenaContext';
import { sound } from '../../../utils/sound';

export const Stage4Showdown: React.FC = () => {
  const { openRegistrationModal } = useArena();

  const criteria = [
    { label: 'BUDGET & COMPONENT STRATEGY', weight: 15, color: '#ff6b00', description: 'Optimal auction bidding and remaining budget points ratio.' },
    { label: 'CIRCUIT DESIGN QUALITY', weight: 25, color: '#00f0ff', description: 'Schematic clarity, safety margins, and component pairing.' },
    { label: 'TECHNICAL EXPLANATION', weight: 15, color: '#ffb700', description: 'Comprehensive rationale for component selection and logic.' },
    { label: 'WORKING CIRCUIT / IMPLEMENTATION', weight: 30, color: '#00ff66', description: 'Functional breadboard performance under real power load.' },
    { label: 'TROUBLESHOOTING & VIVA DEFENSE', weight: 15, color: '#a855f7', description: 'Speed and accuracy when solving induced hardware faults.' }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#ffb700] uppercase tracking-widest">[ FINAL STAGE ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            CIRCUIT SHOWDOWN
          </h3>
          <p className="text-xs font-mono text-[#ff6b00] tracking-widest mt-1">
            ONLY ONE TEAM LEAVES AS CHAMPION
          </p>
        </div>

        <div className="px-4 py-2 bg-[#ffb700]/10 border border-[#ffb700] rounded text-[#ffb700] font-display font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,183,0,0.3)]">
          <Trophy className="w-4 h-4 text-[#ffb700]" /> GRAND FINALE EVALUATION
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">
        The ultimate confrontation. Teams present their working hardware build to the master panel of judges. Total evaluation synthesizes all 5 strategic disciplines into a single 100% composite score.
      </p>

      {/* Championship Scoring Framework Breakdown */}
      <div className="glass-panel p-6 rounded-xl border border-[#ffb700]/40 hud-box bg-gradient-to-br from-[#0e111a] to-[#07080c]">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h4 className="font-display font-bold text-lg text-white">
              OFFICIAL EVALUATION MATRIX
            </h4>
            <span className="text-xs font-mono text-slate-400">WEIGHTED SCORING WEIGHTS</span>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black font-display text-white text-glow-orange">100%</span>
            <span className="block text-[9px] font-mono text-slate-400">TOTAL EVALUATION</span>
          </div>
        </div>

        {/* Scoring Bars */}
        <div className="space-y-5">
          {criteria.map((c, idx) => (
            <div key={idx} className="space-y-1.5 font-mono">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-200">{c.label}</span>
                <span className="font-bold" style={{ color: c.color }}>{c.weight}%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">{c.description}</p>

              <div className="w-full h-3 bg-[#07080c] border border-slate-800 rounded overflow-hidden p-0.5">
                <div
                  className="h-full rounded-sm transition-all duration-1000 ease-out"
                  style={{
                    width: `${c.weight * 3.33}%`,
                    backgroundColor: c.color,
                    boxShadow: `0 0 10px ${c.color}`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Circuit Arena Champion Trophy Visual */}
      <div className="p-8 bg-gradient-to-b from-[#0e111a] to-[#07080c] border-2 border-[#ffb700] rounded-xl text-center relative overflow-hidden shadow-[0_0_50px_rgba(255,183,0,0.2)]">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#ffb700]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#07080c] border-2 border-[#ffb700] rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,183,0,0.5)] animate-pulse">
            <Trophy className="w-10 h-10 text-[#ffb700]" />
          </div>

          <h4 className="text-2xl sm:text-3xl font-black font-display text-white tracking-widest uppercase text-glow-orange mb-1">
            🏆 CIRCUIT ARENA CHAMPION
          </h4>

          <p className="text-xs font-mono text-slate-300 max-w-lg mb-6">
            The winning squad takes home the grand trophy, official title, and engineering excellence commendations.
          </p>

          <button
            onClick={() => {
              sound.playClick();
              openRegistrationModal();
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-[#ffb700] via-[#ff6b00] to-[#ffaa00] text-black font-display font-black text-xs tracking-wider uppercase rounded shadow-[0_0_25px_rgba(255,183,0,0.6)] hover:scale-105 transition-transform"
          >
            [ CLAIM YOUR CHAMPIONSHIP SPOT ]
          </button>
        </div>

      </div>

    </div>
  );
};
