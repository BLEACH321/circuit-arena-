import React, { useState } from 'react';
import { BookOpen, Users, DollarSign, Cpu, ShieldCheck, FileText, CheckSquare, X } from 'lucide-react';
import { sound } from '../../utils/sound';

export const RulesBook: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const mainRules = [
    {
      title: 'TEAM RULE',
      icon: Users,
      color: '#ff6b00',
      summary: 'Teams consist of 1–4 participants from recognized engineering institutions.'
    },
    {
      title: 'BUDGET RULE',
      icon: DollarSign,
      color: '#00f0ff',
      summary: 'Each squad receives a fixed starting virtual budget of 2000 points.'
    },
    {
      title: 'COMPONENT RULE',
      icon: Cpu,
      color: '#ffb700',
      summary: 'Teams strictly use components procured via live auction or official store.'
    },
    {
      title: 'SAFETY RULE',
      icon: ShieldCheck,
      color: '#00ff66',
      summary: 'Strict observance of high-voltage isolation, ESD protection, and lab protocols.'
    },
    {
      title: 'DESIGN RULE',
      icon: FileText,
      color: '#a855f7',
      summary: 'Teams present circuit schematics and justify engineering component logic.'
    },
    {
      title: 'EVALUATION RULE',
      icon: CheckSquare,
      color: '#ff2a5f',
      summary: 'Judging strictly follows the official 5-tier 100% composite score matrix.'
    }
  ];

  return (
    <section id="rules" className="py-24 px-4 relative z-10 bg-[#06070a]/90">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e111a] border border-[#ff6b00]/40 text-[#ff6b00] font-mono text-xs tracking-widest uppercase rounded mb-4">
            <BookOpen className="w-4 h-4 text-[#00f0ff]" />
            COMPETITION DIRECTIVES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
            ARENA <span className="text-[#ff6b00] text-glow-orange">RULEBOOK</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base">
            All participating squads must comply with official Circuit Arena regulations throughout all four competition rounds.
          </p>
        </div>

        {/* 6 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mainRules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => sound.playClick()}
                className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-[#ff6b00]/50 transition-all hud-box flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      RULE 0{idx + 1}
                    </span>
                    <div className="p-2 bg-[#07080c] rounded border border-slate-800" style={{ color: rule.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2">{rule.title}</h3>
                  <p className="text-slate-300 text-xs font-sans leading-relaxed">
                    {rule.summary}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>MANDATORY PROTOCOL</span>
                  <span className="text-[#00ff66]">ACTIVE</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button Trigger */}
        <div className="text-center">
          <button
            onClick={() => {
              sound.playClick();
              setModalOpen(true);
            }}
            className="px-8 py-3.5 bg-[#0e111a] border border-[#ff6b00] hover:bg-[#ff6b00] text-white hover:text-black font-display font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)]"
          >
            [ VIEW COMPLETE RULEBOOK ]
          </button>
        </div>

      </div>

      {/* Complete Rulebook Modal Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 scanline-overlay">
          <div className="w-full max-w-3xl bg-[#0e111a] border border-[#ff6b00]/50 rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto hud-box text-left space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  COMPLETE CIRCUIT ARENA REGULATION MANUAL
                </h3>
                <span className="text-xs font-mono text-[#00f0ff]">VERSION 2026.1 • OFFICIAL DIRECTIVES</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 bg-[#07080c] border border-slate-700 hover:border-[#ff6b00] rounded text-slate-300"
              >
                <X className="w-5 h-5 text-[#ff6b00]" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
              <section className="space-y-1 bg-[#07080c] p-4 rounded border border-slate-800">
                <h4 className="font-display font-bold text-white text-sm text-[#ff6b00]">1. TEAM COMPOSITION &amp; ELIGIBILITY</h4>
                <p>Teams must comprise between 1 and 4 enrolled students. A designated Team Leader acts as the primary contact for budget allocation and stage transitions.</p>
              </section>

              <section className="space-y-1 bg-[#07080c] p-4 rounded border border-slate-800">
                <h4 className="font-display font-bold text-white text-sm text-[#00f0ff]">2. VIRTUAL BUDGET ALGORITHM</h4>
                <p>Every team receives 2000 virtual points at Stage 0. Auction bids are binding. Unspent budget contributes directly to Stage 4 score calculations.</p>
              </section>

              <section className="space-y-1 bg-[#07080c] p-4 rounded border border-slate-800">
                <h4 className="font-display font-bold text-white text-sm text-[#ffb700]">3. HARDWARE &amp; BREADBOARD RESTRICTIONS</h4>
                <p>External or un-auctioned active components (microcontrollers, relays, sensors) are prohibited. Teams found using unauthorized components face immediate disqualification.</p>
              </section>

              <section className="space-y-1 bg-[#07080c] p-4 rounded border border-slate-800">
                <h4 className="font-display font-bold text-white text-sm text-[#00ff66]">4. SAFETY &amp; HIGH-VOLTAGE ISOLATION</h4>
                <p>Mains voltage connections must pass opto-isolated safety checks prior to live energization. Safety goggles and ESD wrist straps must be worn during breadboard assembly.</p>
              </section>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-[#ff6b00] text-black font-display font-bold text-xs uppercase rounded"
              >
                [ CLOSE RULEBOOK ]
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
