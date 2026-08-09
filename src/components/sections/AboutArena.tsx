import React from 'react';
import { Brain, Cpu, ShieldCheck, CircuitBoard, Activity } from 'lucide-react';
import { sound } from '../../utils/sound';

export const AboutArena: React.FC = () => {
  const cards = [
    {
      number: '01',
      title: 'STRATEGY',
      subtitle: 'BUDGET & AUCTION MANAGEMENT',
      description: 'Manage your starting virtual budget of 2000 points. Outsmart rival teams in live auctions for high-rarity ICs and relays, then optimize purchases at the Electronics Store.',
      icon: Brain,
      color: '#ff6b00',
      glow: 'shadow-[0_0_30px_rgba(255,107,0,0.25)]',
      border: 'border-[#ff6b00]/40'
    },
    {
      number: '02',
      title: 'ENGINEERING',
      subtitle: 'SCHEMATIC & BREADBOARD BUILD',
      description: 'Select problem statements, create precise circuit schematics, justify component choices under judge evaluation, and construct functional hardware on a live breadboard.',
      icon: Cpu,
      color: '#00f0ff',
      glow: 'shadow-[0_0_30px_rgba(0,240,255,0.25)]',
      border: 'border-[#00f0ff]/40'
    },
    {
      number: '03',
      title: 'DEFENSE',
      subtitle: 'TROUBLESHOOTING & VIVA EXAM',
      description: 'Diagnose induced circuit faults in real-time, demonstrate power and signal stability, and defend your engineering decisions during expert panel viva examination.',
      icon: ShieldCheck,
      color: '#00ff66',
      glow: 'shadow-[0_0_30px_rgba(0,255,102,0.25)]',
      border: 'border-[#00ff66]/40'
    }
  ];

  return (
    <section id="about" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e111a] border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-xs tracking-widest uppercase rounded mb-4">
            <CircuitBoard className="w-4 h-4 text-[#ff6b00]" />
            MISSION ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
            WELCOME TO <span className="text-[#ff6b00] text-glow-orange">CIRCUIT ARENA</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Circuit Arena is a technical team competition combining strategic budgeting, component procurement, circuit design, practical implementation, presentation and real-time troubleshooting.
          </p>
        </div>

        {/* 3 Large Futuristic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                onMouseEnter={() => sound.playClick()}
                className={`glass-panel p-8 rounded-xl border ${card.border} ${card.glow} relative group hover:-translate-y-2 transition-all duration-300 hud-box overflow-hidden flex flex-col justify-between`}
              >
                {/* Background Number Accent */}
                <span className="absolute -top-4 -right-4 text-7xl font-black font-display opacity-10 text-white select-none">
                  {card.number}
                </span>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold tracking-widest px-2.5 py-1 rounded bg-[#07080c] border border-slate-700 text-slate-300">
                      PHASE {card.number}
                    </span>
                    <div
                      className="p-3 rounded-lg bg-[#07080c] border border-slate-800 group-hover:scale-110 transition-transform"
                      style={{ color: card.color }}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold font-display text-white tracking-wider mb-1 flex items-center gap-2">
                    {card.title}
                  </h3>
                  <p className="text-[10px] font-mono tracking-widest uppercase mb-4 text-[#00f0ff]">
                    {card.subtitle}
                  </p>

                  <p className="text-slate-300 text-sm leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                {/* Animated status bar */}
                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-[#00f0ff]" /> STAGE STATUS
                  </span>
                  <span className="text-[#00ff66] font-bold">[ READY ]</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
