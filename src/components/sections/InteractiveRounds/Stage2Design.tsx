import React, { useState } from 'react';
import { FileCode2 } from 'lucide-react';
import { sound } from '../../../utils/sound';

export const Stage2Design: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<number>(0);
  const [evaluationStatus, setEvaluationStatus] = useState<'PENDING' | 'EVALUATING' | 'APPROVED'>('APPROVED');

  const problems = [
    {
      id: 1,
      title: 'Automated Power Grid Load Balancer',
      category: 'POWER & RELAY SYSTEMS',
      diagram: 'V_IN [12V] ──[ RELAY ]──[ STEP-DOWN TRANS ]──[ SENSOR ] ──> IC CONTROLLER',
      components: ['Microcontroller IC', 'Opto-Relay', 'Step-Down Transformer', 'Resistors (10k)', 'Jumper Wires'],
      working: 'Monitors line current through the sensor. When load spikes exceed 2.5A, the IC signals the opto-isolated relay to trip secondary transformer windings, preventing power cascade failure.',
      justification: 'Opto-isolation guarantees high-voltage isolation for micro-controller logic rails.'
    },
    {
      id: 2,
      title: 'High-Frequency Ultrasonic Array Switch',
      category: 'SIGNAL & SENSOR MATRIX',
      diagram: 'SENSOR ARRAY ──[ OP-AMP ]──[ IC LOGIC ]──[ STEPPER MOTOR ] ──> FEEDBACK LOOP',
      components: ['Ultrasonic Sensor Array', 'Microcontroller IC', 'Stepper Motor', 'Capacitors', 'LED Matrix'],
      working: 'Receives reflected ultrasonic acoustic waves, computes distance offset via pulse timing in IC interrupt loop, and rotates stepper motor shaft to realign directional antenna array.',
      justification: 'High-speed timer interrupts minimize sonar reflection calculation latency to < 1.2ms.'
    },
    {
      id: 3,
      title: 'Emergency Over-Current Relay Protection',
      category: 'SAFETY & INDUSTRIAL CONTROL',
      diagram: 'INPUT MAINS ──[ CURRENT SENSOR ]──[ COMPARATOR IC ]──[ RELAY SWITCH ] ──> SHUTDOWN',
      components: ['Opto-Isolated Relay Mod', 'Microcontroller IC', 'Resistors Pack', 'Status LEDs'],
      working: 'Continuous analog comparison against internal voltage reference. Rapid hardware shutdown within 15 microseconds of fault current detection.',
      justification: 'Hardware voltage comparator bypasses software delay for instantaneous trip execution.'
    }
  ];

  const currentProb = problems[selectedProblem];

  const handleRunEvaluation = () => {
    sound.playDiagnostics();
    setEvaluationStatus('EVALUATING');
    setTimeout(() => {
      setEvaluationStatus('APPROVED');
    }, 1200);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest">[ STAGE 2 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            DESIGN ARENA
          </h3>
          <p className="text-xs font-mono text-[#ffb700] tracking-widest mt-1">
            DESIGN UNDER PRESSURE • SCHEMATIC ARCHITECTURE
          </p>
        </div>

        {/* Status Badge */}
        <div className="px-4 py-2 bg-[#07080c] border border-[#00f0ff]/40 rounded flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400">JUDGE REVIEW STATUS:</span>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              evaluationStatus === 'APPROVED'
                ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30'
                : 'bg-amber-950 text-amber-300 border border-amber-600 animate-pulse'
            }`}
          >
            {evaluationStatus === 'APPROVED' ? '✓ APPROVED BY PANEL' : 'UNDER EVALUATION'}
          </span>
        </div>
      </div>

      {/* Workflow Step Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs text-center">
        <div className="p-3 bg-[#07080c] border border-[#ff6b00]/50 rounded text-[#ff6b00] font-bold">
          1. SELECT PROBLEM
        </div>
        <div className="p-3 bg-[#07080c] border border-[#00f0ff]/50 rounded text-[#00f0ff] font-bold">
          2. DESIGN CIRCUIT
        </div>
        <div className="p-3 bg-[#07080c] border border-[#ffb700]/50 rounded text-[#ffb700] font-bold">
          3. EXPLAIN WORKING
        </div>
        <div className="p-3 bg-[#07080c] border border-[#00ff66]/50 rounded text-[#00ff66] font-bold">
          4. EVALUATION
        </div>
      </div>

      {/* Problem Selection Selector */}
      <div>
        <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
          CHOOSE PROBLEM STATEMENT:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {problems.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                sound.playClick();
                setSelectedProblem(idx);
                handleRunEvaluation();
              }}
              className={`p-4 rounded text-left border transition-all ${
                selectedProblem === idx
                  ? 'bg-[#0e111a] border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-[#07080c] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono text-[#00f0ff] block mb-1">{p.category}</span>
              <h5 className="font-display font-bold text-sm text-white">{p.title}</h5>
            </button>
          ))}
        </div>
      </div>

      {/* Blueprint Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Circuit Diagram Box */}
        <div className="glass-panel p-6 rounded-lg border border-[#00f0ff]/30 hud-box bg-cyber-grid flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#00f0ff]" />
                CIRCUIT BLUEPRINT SCHEMATIC
              </h4>
              <span className="text-[10px] font-mono text-[#00f0ff]">CAD.SCH.V1</span>
            </div>

            <div className="p-4 bg-[#050609] border border-[#00f0ff]/40 rounded font-mono text-xs text-[#00f0ff] overflow-x-auto leading-relaxed shadow-inner">
              <p className="text-slate-500 mb-2">// SCHEMATIC VECTOR MAPPING:</p>
              <code className="text-[#00ff66] font-bold block bg-black/60 p-3 rounded border border-slate-800">
                {currentProb.diagram}
              </code>
            </div>

            {/* Component Selection list */}
            <div className="mt-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                PROCURED COMPONENT SELECTION:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentProb.components.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#07080c] border border-slate-700 rounded text-xs font-mono text-slate-200">
                    + {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>VOLTAGE RAIL: 12V DC / 5V LOGIC</span>
            <span>ISOLATION: OPTO-COUPLED</span>
          </div>
        </div>

        {/* Working & Rationale Panels */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-lg border border-slate-800">
            <h5 className="font-display font-bold text-xs text-[#ffb700] uppercase tracking-wider mb-2">
              WORKING PRINCIPLE
            </h5>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              {currentProb.working}
            </p>
          </div>

          <div className="glass-panel p-5 rounded-lg border border-slate-800">
            <h5 className="font-display font-bold text-xs text-[#ff6b00] uppercase tracking-wider mb-2">
              DESIGN JUSTIFICATION &amp; DEFENSE
            </h5>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              {currentProb.justification}
            </p>
          </div>

          <div className="p-4 bg-[#07080c] border border-[#00ff66]/30 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">JUDGE EVALUATION RESULT:</span>
              <span className="text-xs font-mono font-bold text-[#00ff66]">
                SCHEMATIC APPROVED FOR BREADBOARD ASSEMBLY
              </span>
            </div>
            <button
              onClick={handleRunEvaluation}
              className="px-3 py-1.5 bg-[#00f0ff] hover:bg-[#5ce1e6] text-black font-display font-bold text-xs rounded transition-colors"
            >
              [ RE-EVALUATE ]
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
