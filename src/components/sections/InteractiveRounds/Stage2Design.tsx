import React, { useState } from 'react';
import { Lock, ArrowRight, Activity } from 'lucide-react';
import { sound } from '../../../utils/sound';

export const Stage2Design: React.FC = () => {
  const [lockedIn, setLockedIn] = useState<boolean>(true);

  const handleLockInTransition = () => {
    sound.playSuccess();
    setLockedIn(false);
  };

  if (lockedIn) {
    return (
      <div className="space-y-8 text-center font-mono max-w-2xl mx-auto py-12 animate-fade-in">
        {/* Lock Screen Header */}
        <div className="w-20 h-20 bg-red-950/20 border-2 border-[#ff1a40] rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,26,64,0.45)] animate-pulse">
          <Lock className="w-10 h-10 text-[#ff1a40]" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07080c] border border-red-500/30 text-red-500 text-xs font-bold uppercase rounded">
            MARKET SHUTDOWN STATUS: ACTIVE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white uppercase tracking-wider">
            THE LOCK-IN
          </h2>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-[#0e111a] space-y-4">
          <p className="text-slate-300 text-sm font-sans leading-relaxed">
            "Once the market closes: <strong className="text-red-500 uppercase">NO MORE BUYING</strong>."
          </p>
          <p className="text-slate-400 text-xs font-sans leading-relaxed">
            The squad's component inventory has been officially recorded and finalized by the Jury. The physical procurement phase is sealed.
          </p>
          
          <div className="p-4 bg-red-950/30 border border-[#ff1a40]/30 rounded-xl font-display font-black text-sm text-glow-orange text-[#ff6b00] uppercase tracking-wide">
            "You cannot buy your way out of a bad decision."
          </div>
        </div>

        <button
          onClick={handleLockInTransition}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#ff6b00] to-[#ff1a40] text-white font-display font-black text-xs uppercase rounded transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          [ INITIALIZE THE FINAL MISSION ] <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left font-mono animate-fade-in">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#ff6b00] uppercase tracking-widest">[ STAGE 2 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            THE FINAL MISSION
          </h3>
          <p className="text-xs font-mono text-[#00f0ff] tracking-widest mt-1">
            COMMON PROBLEM STATEMENT REVEALED
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff66]/10 border border-[#00ff66]/60 rounded text-[#00ff66] text-xs font-bold">
          <Activity className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <span>ACTIVE MISSION DISPATCH</span>
        </div>
      </div>

      <div className="p-4 bg-[#0e111a] border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300 font-sans">
        Every team in the Circuit Arena receives the exact same mission. The organizing committee reveals the common problem statement to all competing squads simultaneously.
      </div>

      {/* Main Problem Statement Visual Diagram */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-2 border-[#ff6b00]/60 bg-gradient-to-b from-[#121624]/60 to-[#07080c]/90 space-y-6 shadow-[0_0_25px_rgba(255,107,0,0.1)]">
        
        <div className="space-y-2 border-b border-slate-900 pb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#ff6b00]/10 border border-[#ff6b00]/30 text-[#ff6b00] text-[10px] font-bold uppercase rounded">
            OFFICIAL PROBLEM STATEMENT DISPATCH
          </div>
          <h4 className="text-2xl font-black font-display text-white uppercase">
            FINAL MISSION: SMART HOME SECURITY SYSTEM
          </h4>
          <p className="text-slate-300 text-xs font-sans">
            Design and construct an active electronic telemetry system capable of detecting and responding to physical security intrusions.
          </p>
        </div>

        {/* Engineering System Diagram */}
        <div className="space-y-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">// SYSTEM ARCHITECTURE DIAGRAM</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Input Node */}
            <div className="p-4 bg-[#07080c] border border-[#ff1a40] rounded-xl text-center space-y-2">
              <span className="text-[9px] text-[#ff1a40] font-bold block uppercase">INPUT / DETECTION</span>
              <strong className="text-white text-xs block">IR / Ultrasonic Sensor</strong>
              <span className="text-[9px] text-slate-500 block">Detects intruder movement / range</span>
              <div className="w-full bg-[#ff1a40]/10 py-1.5 rounded border border-[#ff1a40]/30 text-[9px] text-slate-300">
                Push Button (Simulation)
              </div>
            </div>

            {/* Controller Node */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#07080c] border border-[#00f0ff] rounded-xl text-center space-y-2 relative">
              {/* Connection Indicator wires */}
              <div className="hidden md:block absolute -left-4 top-1/2 w-4 h-0.5 bg-gradient-to-r from-[#ff1a40] to-[#00f0ff]" />
              <div className="hidden md:block absolute -right-4 top-1/2 w-4 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#00ff66]" />
              
              <span className="text-[9px] text-[#00f0ff] font-bold block uppercase">PROCESSOR / LOGIC</span>
              <strong className="text-white text-xs block">Microcontroller (IC)</strong>
              <span className="text-[9px] text-slate-500 block">Runs system telemetry &amp; outputs</span>
            </div>

            {/* Output Node */}
            <div className="p-4 bg-[#07080c] border border-[#00ff66] rounded-xl text-center space-y-2">
              <span className="text-[9px] text-[#00ff66] font-bold block uppercase">OUTPUT / RESPONSE</span>
              
              <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                <div className="p-1 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] rounded">
                  Buzzer (Alarm)
                </div>
                <div className="p-1 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] rounded">
                  LED (Status)
                </div>
                <div className="p-1 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] rounded col-span-2">
                  LCD (Display)
                </div>
                <div className="p-1 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] rounded col-span-2">
                  Servo Motor (Auto Lock)
                </div>
                <div className="p-1 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] rounded col-span-2">
                  Relay (Switching)
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Component Mapping Explainer */}
        <div className="pt-4 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[10px] text-slate-400">
          <div>
            <strong className="text-white block mb-0.5">DETECTION GATE</strong>
            IR/Ultrasonic Sensor mapping inputs on trigger thresholds.
          </div>
          <div>
            <strong className="text-white block mb-0.5">WARNING TELEMETRY</strong>
            Buzzer sound warning &amp; LED flashing status indicators.
          </div>
          <div>
            <strong className="text-white block mb-0.5">LOCK ACTION</strong>
            Servo motor rotation executing mechanical deadbolt locks.
          </div>
          <div>
            <strong className="text-white block mb-0.5">RELAY CONTROL</strong>
            High-power switching relays handling external load connections.
          </div>
        </div>

      </div>

    </div>
  );
};
export default Stage2Design;
