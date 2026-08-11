import React, { useState } from 'react';
import { Layers, Gavel, Cpu, Wrench, Trophy, Lock } from 'lucide-react';
import { Stage1BidWars } from './InteractiveRounds/Stage1BidWars';
import { Stage2Design } from './InteractiveRounds/Stage2Design';
import { Stage3Build } from './InteractiveRounds/Stage3Build';
import { Stage4Showdown } from './InteractiveRounds/Stage4Showdown';
import { sound } from '../../utils/sound';
import { useArena } from '../../context/ArenaContext';

export const EventFlow: React.FC = () => {
  const { arenaOpen, maxUnlockedStage } = useArena();
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
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
            const isLocked = !arenaOpen || (stg.id > maxUnlockedStage);
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
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Icon className="w-4 h-4" style={{ color: stg.color }} />
                  )}
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
          {(!arenaOpen || (activeStage > maxUnlockedStage)) ? (
            <div className="flex flex-col items-center justify-center min-h-[350px] space-y-6 text-center font-mono animate-fade-in">
              <div className="w-16 h-16 bg-[#ff1a40]/10 border-2 border-[#ff1a40] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,26,64,0.4)] animate-pulse">
                <Lock className="w-8 h-8 text-[#ff1a40]" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07080c] border border-red-500/30 text-red-500 text-xs font-bold uppercase rounded">
                  ACCESS STATUS: RESTRICTED
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-wider">
                  ROUND {activeStage} ACCESS LOCKED
                </h4>
                <p className="text-slate-400 text-xs font-mono max-w-md mx-auto leading-relaxed">
                  This stage in the Circuit Arena is currently locked by the event organizers. Prepare your squad, verify your telemetry gate checks, and wait for the live unlock broadcast.
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeStage === 1 && <Stage1BidWars />}
              {activeStage === 2 && <Stage2Design />}
              {activeStage === 3 && <Stage3Build />}
              {activeStage === 4 && <Stage4Showdown />}
            </>
          )}
        </div>

        {/* 13-Phase Timeline at a Glance */}
        <div className="pt-20 border-t border-slate-900 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest block font-bold">// ARENA MASTER TIMELINE</span>
            <h3 className="text-2xl sm:text-4xl font-black font-display text-white uppercase tracking-wider">
              COMPLETE EVENT FLOW AT A Glance
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed">
              The full chronological progression of Circuit Arena: The Finals, from initial check-in to crowning the Champion.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline center line for desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-900 hidden md:block" />

            <div className="space-y-8">
              {[
                { phase: 'PHASE 1', title: 'ENTER THE ARENA', desc: 'Teams register and receive 2000 Circuit Coins', color: '#00f0ff' },
                { phase: 'PHASE 2', title: 'COMPONENT BATTLE', desc: 'Premium component auction starts (+25 increment)', color: '#ff6b00' },
                { phase: 'PHASE 3', title: 'ENGINEERING MARKET', desc: 'Buy basic components from the fixed price store', color: '#00ff66' },
                { phase: 'PHASE 4', title: 'MYSTERY DROP', desc: 'Risk remaining coins for an Advanced Mystery Box (300 Coins)', color: '#ff1a40' },
                { phase: 'PHASE 5', title: 'FINAL ADVANTAGE', desc: 'Open Fortune/Advantage Chit to claim immediate advantages', color: '#a855f7' },
                { phase: 'PHASE 6', title: 'MARKET LOCK', desc: 'Market closes. Components are finalized. NO MORE BUYING.', color: '#e2e8f0' },
                { phase: 'PHASE 7', title: 'FINAL MISSION', desc: 'Common engineering problem statement revealed to all squads', color: '#ffb700' },
                { phase: 'PHASE 8', title: 'BATTLE BLUEPRINT', desc: 'Submit Circuit Diagram, Block Diagram, Components, & Working Principle', color: '#38bdf8' },
                { phase: 'PHASE 9', title: 'TECHNICAL SCREENING', desc: 'Jury evaluates design blueprints to shortlist squads', color: '#f8fafc' },
                { phase: 'PHASE 10', title: 'THE FINALS', desc: 'Shortlisted squads physically build on a breadboard', color: '#ec4899' },
                { phase: 'PHASE 11', title: 'LIVE DEMO', desc: 'Squads demonstrate functional circuits in active scenarios', color: '#22c55e' },
                { phase: 'PHASE 12', title: 'FINAL VIVA', desc: 'Final Jury challenges squads on technical decisions', color: '#f59e0b' },
                { phase: 'PHASE 13', title: 'CHAMPIONSHIP RESULT', desc: 'Circuit Arena Champion is crowned (3rd, Runner-Up, Winner)', color: '#eab308' }
              ].map((p, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className="relative flex flex-col md:flex-row items-center gap-4 md:gap-8 group">
                    {/* Node Dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#07080c] border-2 border-slate-800 z-10 hidden md:flex items-center justify-center group-hover:border-[#ff6b00] group-hover:scale-125 transition-all">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 group-hover:bg-[#ff6b00]" />
                    </div>

                    {/* Left Empty Column on Desktop / Content on Left */}
                    <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end text-left md:text-right' : 'md:order-2 text-left'}`}>
                      <div className="glass-panel p-5 rounded-xl border border-slate-900 group-hover:border-[#00f0ff]/40 bg-[#07080c]/60 max-w-sm transition-all duration-300 relative shadow-md">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-slate-900 group-hover:bg-[#00f0ff] transition-all" />
                        <span className="font-mono text-[9px] font-bold tracking-widest block mb-1" style={{ color: p.color }}>
                          {p.phase}
                        </span>
                        <h4 className="font-display font-bold text-sm text-white uppercase">{p.title}</h4>
                        <p className="text-slate-400 text-[10px] font-sans mt-1.5 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>

                    {/* Right Empty Column on Desktop */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
