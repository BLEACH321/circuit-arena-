import React, { useState } from 'react';
import { CircuitBoard, Coins, Brain, HelpCircle, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

export const AboutArena: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  const eventElements = [
    'Strategic bidding',
    'Resource management',
    'Smart component selection',
    'Surprise challenges',
    'Circuit design',
    'Engineering creativity',
    'Physical circuit implementation',
    'Technical presentation',
    'Viva and problem-solving'
  ];

  const terminologies = [
    { normal: 'Team', themed: 'Engineering Squad', desc: 'The group of competitors collaborating on the design and implementation.' },
    { normal: 'Participants', themed: 'Competitors', desc: 'The individual minds engaging in the championship.' },
    { normal: 'Circuit Coins', themed: 'Circuit Coins', desc: 'The starting virtual currency preloaded to every squad.' },
    { normal: 'Auction', themed: 'Component Battle', desc: 'The high-stakes bidding round for premium components.' },
    { normal: 'Electronics Store', themed: 'Engineering Market', desc: 'The fixed-price market for basic electronics components.' },
    { normal: 'Mystery Box', themed: 'Mystery Drop', desc: 'The random component pool option introducing risk/reward decisions.' },
    { normal: 'Fortune Chit', themed: 'Final Advantage', desc: 'The immediate advantage chits opened before design.' },
    { normal: 'Problem Statement', themed: 'Final Mission', desc: 'The common engineering task revealed to all squads.' },
    { normal: 'Circuit Design', themed: 'Battle Blueprint', desc: 'The design connections, block diagrams, and working principles.' },
    { normal: 'Circuit Building', themed: 'Final Build', desc: 'The physical assembly of components on a breadboard.' },
    { normal: 'Judges', themed: 'Final Jury', desc: 'The expert panel evaluating the squads and designs.' },
    { normal: 'Finalists', themed: 'Championship Squads', desc: 'The top-tier teams qualifying for physical building.' },
    { normal: 'Winner', themed: 'Circuit Champion', desc: 'The squad crowned at the end of the viva defense.' }
  ];

  return (
    <section id="about" className="py-24 px-4 relative z-10 bg-[#06070a]/60">
      
      {/* Event Overview Section */}
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Panel: Description and elements */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e111a] border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-xs tracking-widest uppercase rounded">
              <CircuitBoard className="w-4 h-4 text-[#ff6b00]" />
              MISSION BRIEFING
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
              EVENT <span className="text-[#ff6b00] text-glow-orange">OVERVIEW</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Circuit Arena: The Finals is a competitive electronics engineering event where teams compete through multiple stages to become the ultimate Circuit Champion.
            </p>

            <div className="glass-panel p-5 rounded-xl border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.05)] bg-[#07080c]/60 flex items-start gap-4">
              <Coins className="w-8 h-8 text-[#ffb700] shrink-0 mt-1" />
              <div className="space-y-1">
                <span className="text-white font-mono font-bold text-xs uppercase tracking-wider block">ALLOCATED CAPITAL INITIALIZATION</span>
                <p className="text-slate-300 text-xs font-sans">
                  Every team begins with the same virtual budget of <strong className="text-[#ffb700]">2000 Circuit Coins</strong>. 
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400">
              <span className="text-slate-200 font-bold block uppercase tracking-wider">CHAMPIONSHIP CORE PILLARS:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {eventElements.map((el, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#0e111a] border border-slate-900 rounded">
                    <span className="w-1.5 h-1.5 bg-[#ff1a40] rounded-full shrink-0" />
                    <span className="text-[11px] uppercase tracking-wide">{el}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Strategic Challenge */}
          <div className="glass-panel p-8 sm:p-10 rounded-2xl border-2 border-[#ff6b00]/60 hud-box bg-gradient-to-b from-[#121624]/80 to-[#07080c]/90 text-left space-y-6 shadow-[0_0_30px_rgba(255,107,0,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="w-12 h-12 bg-[#07080c] border border-slate-800 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#ff6b00]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest block font-bold">THE STRATEGIC CHALLENGE</span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white uppercase">
                BUDGET MANAGEMENT &amp; RESOURCE ALLOCATION
              </h3>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
              The teams must decide where to spend their limited resources. They can bid for premium components, purchase basic components, take risks with mystery boxes, and use their fortune advantage.
            </p>

            <div className="p-4 bg-[#07080c] border border-slate-800 rounded-lg font-mono text-[11px] text-slate-400 space-y-2 leading-relaxed">
              <span className="text-[#ff1a40] font-bold block uppercase tracking-wider">// JURY PROTOCOL DIRECTIVE:</span>
              <p>
                Once the market closes, all teams receive the engineering problem statement. The challenge is then: <strong className="text-white">Can you turn the resources you fought for into the best working solution?</strong>
              </p>
            </div>

            <p className="text-[11px] font-mono text-[#00ff66] uppercase tracking-widest block font-bold">
              ➔ Physical builds occur live in "The Finals" before the judges.
            </p>
          </div>
        </div>

        {/* Core Theme Terminology Section */}
        <div className="space-y-8 pt-12 border-t border-slate-900">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e111a] border border-[#ffb700]/40 text-[#ffb700] font-mono text-xs tracking-widest uppercase rounded">
              <Sparkles className="w-4 h-4 text-[#ffb700]" />
              CHAMPIONSHIP DICTIONARY
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white tracking-wide uppercase">
              THE CORE THEME — <span className="text-[#00f0ff] text-glow-cyan">“THE FINALS”</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-sans">
              To drive a professional championship atmosphere, we use official technical-esports terminology. Click any terminology node below to load the decoder.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Terminology Selector List */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar font-mono text-xs text-left">
              {terminologies.map((t, idx) => {
                const isActive = selectedTerm === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setSelectedTerm(idx);
                    }}
                    className={`p-3 rounded border text-left flex justify-between items-center transition-all ${
                      isActive
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)] text-white'
                        : 'bg-[#07080c] border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                    }`}
                  >
                    <span className="font-sans font-bold">{t.normal}</span>
                    <span className="text-[10px] text-[#ff1a40] uppercase font-bold shrink-0">
                      ➔ {t.themed}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Terminology Interactive Decoder Screen */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-[#0e111a]/80 text-left flex flex-col justify-between min-h-[220px]">
              {selectedTerm !== null ? (
                <div className="space-y-4 font-mono text-xs flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase block">STANDARD GLOSSARY TERM:</span>
                    <span className="text-slate-200 text-sm font-sans font-bold block">{terminologies[selectedTerm].normal}</span>
                  </div>
                  
                  <div className="p-3 bg-[#07080c] border border-slate-900 rounded space-y-1">
                    <span className="text-[9px] text-[#00f0ff] font-bold uppercase tracking-wider block">ARENA DECODED TERMINOLOGY:</span>
                    <span className="text-white text-base font-black uppercase text-glow-cyan block">
                      {terminologies[selectedTerm].themed}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                    {terminologies[selectedTerm].desc}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center font-mono text-xs text-slate-500 h-full py-10 space-y-3">
                  <HelpCircle className="w-10 h-10 text-slate-700 animate-pulse" />
                  <p>Select any terminology keyword on the left to activate the holographic decoder.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
export default AboutArena;
