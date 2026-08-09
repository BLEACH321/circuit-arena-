import React, { useState } from 'react';
import { Cpu, Activity, AlertOctagon, CheckCircle2, RefreshCw, Zap, Radio } from 'lucide-react';
import { sound } from '../../../utils/sound';

export const Stage3Build: React.FC = () => {
  const [diagnosticsRunning, setDiagnosticsRunning] = useState<boolean>(false);
  const [systemFixed, setSystemFixed] = useState<boolean>(false);

  const handleRunDiagnostics = () => {
    sound.playDiagnostics();
    setDiagnosticsRunning(true);

    setTimeout(() => {
      setDiagnosticsRunning(false);
      setSystemFixed(true);
      sound.playSuccess();
    }, 1800);
  };

  const handleResetDiagnostics = () => {
    sound.playClick();
    setSystemFixed(false);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#00ff66] uppercase tracking-widest">[ STAGE 3 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            BUILD ARENA
          </h3>
          <p className="text-xs font-mono text-[#00f0ff] tracking-widest mt-1">
            MAKE IT WORK • BREADBOARD &amp; FAULT DIAGNOSTICS
          </p>
        </div>

        <div className="px-4 py-2 bg-[#07080c] border border-slate-700 rounded flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400">HARDWARE RAIL:</span>
          <span className="text-xs font-mono font-bold text-[#00ff66]">LIVE BREADBOARD POWERED</span>
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">
        Approved teams assemble their working circuit on an experimental breadboard using strictly auctioned and store-purchased components. Teams wire up inputs, inspect output waveforms, and execute real-time fault diagnostics under timed pressure.
      </p>

      {/* Assembly Visual Flow Diagram */}
      <div className="glass-panel p-6 rounded-lg border border-slate-800 text-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-4">
          BREADBOARD IMPLEMENTATION PIPELINE
        </span>
        
        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
          <div className="px-4 py-2 bg-[#07080c] border border-[#ff6b00]/40 rounded text-[#ff6b00] font-bold">
            COMPONENTS
          </div>
          <span className="text-slate-600 font-bold">+</span>
          <div className="px-4 py-2 bg-[#07080c] border border-[#00f0ff]/40 rounded text-[#00f0ff] font-bold">
            BREADBOARD
          </div>
          <span className="text-slate-600 font-bold">+</span>
          <div className="px-4 py-2 bg-[#07080c] border border-[#ffb700]/40 rounded text-[#ffb700] font-bold">
            WIRING
          </div>
          <span className="text-slate-600 font-bold">+</span>
          <div className="px-4 py-2 bg-[#07080c] border border-[#a855f7]/40 rounded text-purple-400 font-bold">
            TESTING
          </div>
          <span className="text-slate-600 font-bold text-lg">=</span>
          <div className="px-5 py-2 bg-[#00ff66]/10 border border-[#00ff66] rounded text-[#00ff66] font-bold shadow-[0_0_15px_rgba(0,255,102,0.3)]">
            WORKING CIRCUIT
          </div>
        </div>
      </div>

      {/* Diagnostics Visual HUD Panel */}
      <div className="glass-panel p-6 rounded-xl border border-[#00f0ff]/30 hud-box bg-[#090b12] relative overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00f0ff] animate-pulse" />
            SYSTEM DIAGNOSTICS &amp; WAVEFORM MONITOR
          </h4>
          <span className="text-[10px] font-mono text-slate-400">HARDWARE SAMPLER V4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Diagnostics Indicators */}
          <div className="space-y-4 font-mono">
            <div className="p-3 bg-[#050609] rounded border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00ff66]" /> POWER RAIL
              </span>
              <span className="text-xs font-bold text-[#00ff66]">ONLINE [ 5.02V ]</span>
            </div>

            <div className="p-3 bg-[#050609] rounded border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00f0ff]" /> SIGNAL INTEGRITY
              </span>
              <span className={`text-xs font-bold ${systemFixed ? 'text-[#00ff66]' : 'text-[#ffb700]'}`}>
                {diagnosticsRunning ? 'ANALYZING...' : systemFixed ? 'STABLE [ 120MHz ]' : 'CHECKING...'}
              </span>
            </div>

            <div className="p-3 bg-[#050609] rounded border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ff6b00]" /> OUTPUT STATE
              </span>
              <span className={`text-xs font-bold ${systemFixed ? 'text-[#00ff66]' : 'text-[#ff2a5f]'}`}>
                {diagnosticsRunning ? 'CORRECTING...' : systemFixed ? 'READY [ 100% ]' : 'ERROR [ IMPEDANCE MISMATCH ]'}
              </span>
            </div>

            <div className="p-4 bg-[#07080c] rounded border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">OVERALL SYSTEM STATUS:</span>
                <span className={`text-sm font-bold font-display ${systemFixed ? 'text-[#00ff66] text-glow-green' : 'text-[#ff2a5f]'}`}>
                  {diagnosticsRunning ? 'DIAGNOSTICS IN PROGRESS...' : systemFixed ? 'ONLINE & VERIFIED' : 'FAULT DETECTED'}
                </span>
              </div>

              {systemFixed && (
                <button
                  onClick={handleResetDiagnostics}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Reset Fault state"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Trigger Button & Diagnostic Waveform Visual */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#050609] rounded-lg border border-slate-800 text-center">
            
            <div className="mb-6 relative">
              <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center ${
                systemFixed ? 'border-[#00ff66] bg-[#00ff66]/10' : 'border-[#ff2a5f] bg-[#ff2a5f]/10'
              }`}>
                {systemFixed ? (
                  <CheckCircle2 className="w-12 h-12 text-[#00ff66]" />
                ) : (
                  <AlertOctagon className="w-12 h-12 text-[#ff2a5f] animate-pulse" />
                )}
              </div>
            </div>

            <button
              onClick={handleRunDiagnostics}
              disabled={diagnosticsRunning}
              className={`w-full py-3 px-6 rounded font-display font-bold text-xs tracking-wider uppercase transition-all ${
                systemFixed
                  ? 'bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66]/30'
                  : 'bg-[#00f0ff] hover:bg-[#5ce1e6] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
            >
              {diagnosticsRunning ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> RUNNING HARDWARE DIAGNOSTICS...
                </span>
              ) : systemFixed ? (
                '[ RE-RUN DIAGNOSTICS TEST ]'
              ) : (
                '[ RUN DIAGNOSTICS ]'
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
