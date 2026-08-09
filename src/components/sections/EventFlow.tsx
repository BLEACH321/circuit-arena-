import React, { useState } from 'react';
import { Layers, Zap, Gavel, Cpu, Wrench, Trophy } from 'lucide-react';
import { Stage0Enter } from './InteractiveRounds/Stage0Enter';
import { Stage1BidWars } from './InteractiveRounds/Stage1BidWars';
import { Stage2Design } from './InteractiveRounds/Stage2Design';
import { Stage3Build } from './InteractiveRounds/Stage3Build';
import { Stage4Showdown } from './InteractiveRounds/Stage4Showdown';
import { sound } from '../../utils/sound';

export const EventFlow: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    { id: 0, tag: 'STAGE 0', title: 'ENTER THE ARENA', subtitle: 'REGISTRATION & BUDGET', icon: Zap, color: '#00f0ff' },
    { id: 1, tag: 'STAGE 1', title: 'BID WARS', subtitle: 'LIVE AUCTION & STORE', icon: Gavel, color: '#ff6b00' },
    { id: 2, tag: 'STAGE 2', title: 'DESIGN ARENA', subtitle: 'SCHEMATIC & BLUEPRINT', icon: Cpu, color: '#ffb700' },
    { id: 3, tag: 'STAGE 3', title: 'BUILD ARENA', subtitle: 'BREADBOARD & FAULT TEST', icon: Wrench, color: '#00ff66' },
    { id: 4, tag: 'FINAL', title: 'CIRCUIT SHOWDOWN', subtitle: 'CHAMPIONSHIP VIVA', icon: Trophy, color: '#a855f7' },
  ];

  const handleStageClick = (id: number) => {
    sound.playClick();
    setActiveStage(id);
  };

  return (
    <section id="rounds" className="py-24 px-4 relative z-10 bg-[#06070a]/90">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e111a] border border-[#ff6b00]/40 text-[#ff6b00] font-mono text-xs tracking-widest uppercase rounded mb-4">
            <Layers className="w-4 h-4 text-[#00f0ff]" />
            COMPETITION TIMELINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
            EVENT <span className="text-[#00f0ff] text-glow-cyan">FLOW &amp; ROUNDS</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base">
            Click any stage node in the HUD timeline below to inspect round details, interactive simulation tools, and evaluation rules.
          </p>
        </div>

        {/* Timeline Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {stages.map((stg) => {
            const Icon = stg.icon;
            const isActive = activeStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => handleStageClick(stg.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? 'bg-[#0e111a] border-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                    : 'bg-[#07080c] border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[#07080c]"
                    style={{ color: stg.color }}
                  >
                    {stg.tag}
                  </span>
                  <Icon className="w-4 h-4" style={{ color: stg.color }} />
                </div>

                <h4 className="font-display font-bold text-sm text-white">{stg.title}</h4>
                <span className="block text-[9px] font-mono text-slate-400 mt-1">{stg.subtitle}</span>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6b00] to-[#00f0ff]" />
                )}
              </button>
            );
          })}
        </div>

        {/* HUD Interactive Stage Detail Panel */}
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-[#ff6b00]/30 hud-box bg-gradient-to-b from-[#0d1019] to-[#07080c] min-h-[500px]">
          {activeStage === 0 && <Stage0Enter />}
          {activeStage === 1 && <Stage1BidWars />}
          {activeStage === 2 && <Stage2Design />}
          {activeStage === 3 && <Stage3Build />}
          {activeStage === 4 && <Stage4Showdown />}
        </div>

      </div>
    </section>
  );
};
