import React, { useState } from 'react';
import { FileCode, Layers, List, Settings, Sparkles, Activity } from 'lucide-react';
import { sound } from '../../../utils/sound';

export const Stage3Build: React.FC = () => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<number | null>(0);
  const [evaluationProgress, setEvaluationProgress] = useState<'IDLE' | 'SCREENING' | 'QUALIFIED'>('IDLE');

  const blueprintCards = [
    {
      id: 0,
      title: 'Circuit Diagram',
      icon: FileCode,
      desc: 'Shows the actual electrical connections, power rails, signal wires, and micro-controller pin configurations.',
      detail: 'Includes exact mapping for the Smart Home Security components: sensor thresholds, pull-up resistors for the simulation button, LED voltage drop limiters, and relay safety diodes.'
    },
    {
      id: 1,
      title: 'Block Diagram',
      icon: Layers,
      desc: 'Shows how different functional sections of the system interact (Input ➔ Logic ➔ Outputs).',
      detail: 'Visualizes structural flow: detection sensors feed ADC inputs, digital outputs drive buzzer/LED drivers, pulse width modulation controls the locking servo, and high-current relays switch secondary circuits.'
    },
    {
      id: 2,
      title: 'Component List',
      icon: List,
      desc: 'Shows which acquired components (from auctions, market, or mystery drops) are being utilized.',
      detail: 'Confirms inventory match with verified prices. Prevents utilization of unauthorized parts or unrecorded active ICs.'
    },
    {
      id: 3,
      title: 'Working Principle',
      icon: Settings,
      desc: 'Explains how the complete system operates under normal and intrusion scenarios.',
      detail: 'Details software interrupt loops, comparator state transitions, physical servo rotation triggers, LCD telemetry strings, and alarm timeout scripts.'
    }
  ];

  const criteria = [
    { name: 'Circuit Design', description: 'Correctness, logic safety, opto-isolation, and efficiency of connection paths.' },
    { name: 'Component Selection', description: 'Rational usage of parts corresponding to the needs of the problem statement.' },
    { name: 'Budget Management', description: 'Optimal allocation of the 2000 Circuit Coins without running out of resources.' },
    { name: 'Technical Knowledge', description: 'Competency in fundamental electronics, circuit dynamics, and troubleshooting.' },
    { name: 'Innovation', description: 'Novel additions beyond the basic requirements (e.g. intelligent status loops).' }
  ];

  const handleRunScreening = () => {
    sound.playDiagnostics();
    setEvaluationProgress('SCREENING');
    setTimeout(() => {
      setEvaluationProgress('QUALIFIED');
      sound.playSuccess();
    }, 1500);
  };

  return (
    <div className="space-y-8 text-left font-mono animate-fade-in">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#ffb700] uppercase tracking-widest">[ STAGE 3 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            THE BATTLE BLUEPRINT
          </h3>
          <p className="text-xs font-mono text-[#00f0ff] tracking-widest mt-1">
            SOLUTION ARCHITECTURE &amp; DIAGRAM DESIGN
          </p>
        </div>

        {/* Screening status */}
        <div className="px-4 py-2 bg-[#07080c] border border-slate-800 rounded flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400">SCREENING STATUS:</span>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              evaluationProgress === 'QUALIFIED'
                ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30'
                : evaluationProgress === 'SCREENING'
                ? 'bg-amber-950 text-amber-300 border border-amber-600 animate-pulse'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {evaluationProgress === 'QUALIFIED'
              ? '✓ QUALIFIED FOR FINALS'
              : evaluationProgress === 'SCREENING'
              ? 'RUNNING EVALUATION...'
              : 'STANDBY'}
          </span>
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed font-sans">
        Before physically building, squads prepare and submit their complete solution blueprints. The Final Jury evaluates the submissions against the official technical screening matrix.
      </p>

      {/* 4 Blueprint Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {blueprintCards.map((b, idx) => {
          const Icon = b.icon;
          const isActive = selectedBlueprint === idx;
          return (
            <button
              key={b.id}
              onClick={() => { sound.playClick(); setSelectedBlueprint(idx); }}
              className={`p-5 rounded-xl border text-left flex flex-col justify-between min-h-[160px] transition-all ${
                isActive
                  ? 'bg-[#0e111a] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)] text-white'
                  : 'bg-[#07080c] border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">SUBMISSION 0{idx + 1}</span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00f0ff]' : 'text-slate-500'}`} />
                </div>
                <h4 className="font-display font-bold text-xs uppercase text-white">{b.title}</h4>
                <p className="text-[10px] font-sans leading-relaxed text-slate-400">{b.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Blueprint Detail Viewer / Sandbox */}
      {selectedBlueprint !== null && (
        <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-[#07080c]/80 space-y-3">
          <span className="text-[9px] text-[#00f0ff] font-bold uppercase tracking-wider block">
            ➔ SELECTED SUBMISSION DETAILS ({blueprintCards[selectedBlueprint].title})
          </span>
          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            {blueprintCards[selectedBlueprint].detail}
          </p>
        </div>
      )}

      {/* Technical Evaluation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Criteria List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-slate-800 space-y-4 text-left">
          <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#ffb700]">
            <Sparkles className="w-4 h-4 text-[#ffb700]" /> TECHNICAL EVALUATION MATRIX
          </h4>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            The Final Jury evaluates the submissions based on the 5 official criteria. Competing squads must clear this screening to qualify for physical implementation.
          </p>

          <div className="space-y-2">
            {criteria.map((c, idx) => (
              <div key={idx} className="p-3 bg-[#07080c]/60 border border-slate-900 rounded flex justify-between gap-4">
                <div className="space-y-1">
                  <strong className="text-white text-xs font-sans block">{c.name}</strong>
                  <span className="text-[10px] text-slate-400 font-sans block leading-normal">{c.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Technical screening tool */}
        <div className="glass-panel p-6 rounded-xl border-2 border-[#ffb700]/60 bg-gradient-to-b from-[#141824]/80 to-[#07080c]/90 text-center flex flex-col justify-between min-h-[300px]">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-[#07080c] border border-slate-800 rounded-xl flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Activity className="w-6 h-6 text-[#ffb700]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#ffb700] uppercase font-bold tracking-widest block">// SCREENING STAGE</span>
              <h4 className="font-display font-black text-sm text-white uppercase">JURY EVALUATION PORTAL</h4>
            </div>
            <p className="text-slate-400 text-[10px] font-sans leading-relaxed">
              Verify compliance of Circuit Diagrams, Block Diagrams, Component list, and Working Principles to obtain qualification.
            </p>
          </div>

          <div className="space-y-3 mt-6">
            {evaluationProgress === 'QUALIFIED' ? (
              <div className="p-3 bg-[#00ff66]/10 border border-[#00ff66]/40 rounded text-[#00ff66] text-xs font-bold font-mono">
                ✓ SQUAD QUALIFIED FOR THE PHYSICAL FINALS
              </div>
            ) : (
              <button
                onClick={handleRunScreening}
                disabled={evaluationProgress === 'SCREENING'}
                className="w-full py-2.5 bg-[#ffb700] hover:bg-[#ffc83b] text-black font-display font-black text-xs uppercase rounded cursor-pointer"
              >
                {evaluationProgress === 'SCREENING' ? 'SUBMITTING BLUEPRINTS...' : '[ SUBMIT BLUEPRINTS FOR EVALUATION ]'}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default Stage3Build;
