import React, { useState } from 'react';
import { CheckCircle, Target, Award, X } from 'lucide-react';
import { sound } from '../../utils/sound';

export const RulesBook: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const objectives = [
    { num: '01', text: 'Manage a limited budget.' },
    { num: '02', text: 'Make strategic purchasing decisions.' },
    { num: '03', text: 'Select useful components.' },
    { num: '04', text: 'Adapt to an unknown engineering problem.' },
    { num: '05', text: 'Design an efficient circuit.' },
    { num: '06', text: 'Introduce innovative features.' },
    { num: '07', text: 'Physically implement the circuit.' },
    { num: '08', text: 'Explain their technical decisions.' },
    { num: '09', text: 'Defend their design during the viva.' },
    { num: '10', text: 'Perform under final-round pressure.' }
  ];

  return (
    <section id="rules" className="py-24 px-4 relative z-10 bg-[#06070a]/90">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e111a] border border-[#ff6b00]/40 text-[#ff6b00] font-mono text-xs tracking-widest uppercase rounded mb-4">
            <Target className="w-4 h-4 text-[#00f0ff]" />
            COMPETITION DIRECTIVES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
            EVENT <span className="text-[#ff6b00] text-glow-orange">OBJECTIVE</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            The championship objective is not simply to build a circuit, but to test complete engineering capability under real tournament pressure.
          </p>
        </div>

        {/* 10 Core Objective Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {objectives.map((obj, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sound.playClick()}
              className="glass-panel p-5 rounded-xl border border-slate-900 hover:border-[#00f0ff]/50 transition-all hud-box flex flex-col justify-between"
            >
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-mono text-[#00f0ff] font-bold uppercase tracking-widest">
                  OBJECTIVE {obj.num}
                </span>
                <p className="text-white text-xs font-mono tracking-wide leading-relaxed">
                  {obj.text}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-950 flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>EVALUATION TASK</span>
                <CheckCircle className="w-3 h-3 text-[#00ff66]" />
              </div>
            </div>
          ))}
        </div>

        {/* Closing Concept Box */}
        <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border-2 border-[#00ff66]/60 bg-gradient-to-r from-[#0d1617]/50 to-[#07080c]/80 text-center space-y-4 mb-12">
          <Award className="w-10 h-10 text-[#00ff66] mx-auto animate-pulse" />
          <h3 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider">
            THE FORMULA FOR VICTORY
          </h3>
          <p className="text-slate-200 text-sm sm:text-base font-sans italic leading-relaxed">
            "The winning team is the team that demonstrates the best combination of strategy, engineering, innovation and execution."
          </p>
        </div>

        {/* Button Trigger */}
        <div className="text-center">
          <button
            onClick={() => {
              sound.playClick();
              setModalOpen(true);
            }}
            className="px-8 py-3.5 bg-[#0e111a] border border-[#ff6b00] hover:bg-[#ff6b00] text-white hover:text-black font-display font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] cursor-pointer"
          >
            [ VIEW ARENA GENERAL REGULATIONS ]
          </button>
        </div>

      </div>

      {/* Complete Rulebook Modal Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 scanline-overlay">
          <div className="w-full max-w-2xl bg-[#0e111a] border border-[#ff6b00]/50 rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto hud-box text-left space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  CIRCUIT ARENA REGULATIONS MANUAL
                </h3>
                <span className="text-xs font-mono text-[#00f0ff]">OFFICIAL DIRECTIVES &amp; PROTOCOLS</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 bg-[#07080c] border border-slate-700 hover:border-[#ff6b00] rounded text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5 text-[#ff6b00]" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed font-mono">
              <section className="space-y-1 bg-[#07080c] p-4 rounded border border-slate-900">
                <h4 className="font-display font-bold text-white text-xs text-[#ff6b00] uppercase">// BUDGET COMPLIANCE</h4>
                <p>Every Engineering Squad operates with a starting virtual budget of 2000 Circuit Coins. All bids placed during the Component Battle are final and binding.</p>
              </section>

              <section className="space-y-1 bg-[#07080c] p-4 rounded border border-slate-900">
                <h4 className="font-display font-bold text-white text-xs text-[#00f0ff] uppercase">// COMPONENT INTEGRITY</h4>
                <p>Squads must only use components legally procured during the Component Battle, Engineering Market, or from a Mystery Drop. Utilizing unrecorded components will lead to disqualification.</p>
              </section>

              <section className="space-y-1 bg-[#07080c] p-4 rounded border border-slate-900">
                <h4 className="font-display font-bold text-white text-xs text-[#00ff66] uppercase">// PHYSICAL BUILD SAFETY</h4>
                <p>Breadboard implementations must be safe. No active connections to AC power lines are permitted without isolating relays approved by the Final Jury.</p>
              </section>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-[#ff6b00] text-black font-display font-bold text-xs uppercase rounded cursor-pointer"
              >
                [ CLOSE MANUAL ]
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
export default RulesBook;
