import React, { useState } from 'react';
import { Trophy, CheckCircle, HelpCircle, Activity } from 'lucide-react';
import { sound } from '../../../utils/sound';

export const Stage4Showdown: React.FC = () => {
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoLog, setDemoLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const criteria = [
    { label: 'Auction Strategy', weight: 10, color: '#ff6b00', description: 'Evaluation of premium auction bidding performance.' },
    { label: 'Budget Management', weight: 10, color: '#ffaa00', description: 'Management of the starting 2000 coins budget.' },
    { label: 'Smart Purchasing Decisions', weight: 10, color: '#00f0ff', description: 'Component mapping, quantities, and cost optimization.' },
    { label: 'Circuit Design', weight: 20, color: '#a855f7', description: 'Battle Blueprint (schematics, block diagrams, operation).' },
    { label: 'Innovation', weight: 15, color: '#38bdf8', description: 'Intelligent design enhancements beyond basic specs.' },
    { label: 'Circuit Implementation', weight: 20, color: '#00ff66', description: 'Physical breadboard construction and wiring quality.' },
    { label: 'Technical Explanation & Viva', weight: 15, color: '#ff2a5f', description: 'Jury viva defense and electrical troubleshooting.' }
  ];

  const handleSimulateDemo = () => {
    if (isSimulating) return;
    sound.playDiagnostics();
    setIsSimulating(true);
    setDemoStep(1);
    setDemoLog(['Intrusion event initialized...']);

    // Step 2: Buzzer ON
    setTimeout(() => {
      setDemoStep(2);
      setDemoLog(prev => [...prev, '➔ Alarm triggered: Buzzer ON (Alert Tone active)']);
      sound.playClick();
    }, 1000);

    // Step 3: LED ON
    setTimeout(() => {
      setDemoStep(3);
      setDemoLog(prev => [...prev, '➔ Status Indicator: LED ON (Intrusion warning state)']);
      sound.playClick();
    }, 2000);

    // Step 4: LCD -> "INTRUDER DETECTED"
    setTimeout(() => {
      setDemoStep(4);
      setDemoLog(prev => [...prev, '➔ LCD Telemetry Update: "INTRUDER DETECTED"']);
      sound.playClick();
    }, 3000);

    // Step 5: Servo -> Lock position
    setTimeout(() => {
      setDemoStep(5);
      setDemoLog(prev => [...prev, '➔ Mech Lock Engagement: Servo -> Lock position (90 degrees locked)']);
      sound.playSuccess();
      setIsSimulating(false);
    }, 4000);
  };

  const handleResetDemo = () => {
    sound.playClick();
    setDemoStep(0);
    setDemoLog([]);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-8 text-left font-mono animate-fade-in">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#ffb700] uppercase tracking-widest">[ STAGE 4 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            THE FINAL BUILD
          </h3>
          <p className="text-xs font-mono text-[#ff6b00] tracking-widest mt-1">
            Build the solution. Make it work. Defend it.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#ffb700]/10 border border-[#ffb700] rounded text-[#ffb700] font-display font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,183,0,0.3)]">
          <Trophy className="w-4 h-4 text-[#ffb700]" /> THE FINALS DEMO
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed font-sans">
        Shortlisted teams physically assemble their circuits on a breadboard. Build the solution using the components secured in Stage 1, demonstrate the system, and defend your work before the Jury.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Final Demonstration simulator */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-[#07080c]/80 space-y-4">
          <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#00f0ff]">
            <Activity className="w-4 h-4 text-[#00f0ff]" /> FINAL DEMONSTRATION SIMULATOR
          </h4>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            For the Smart Home Security example, test the chronological output sequence when an intrusion event occurs.
          </p>

          <div className="p-4 bg-[#050609] border border-slate-900 rounded space-y-4">
            
            {/* Visual Steps representation */}
            <div className="space-y-2 text-[10px] uppercase font-bold">
              {[
                { step: 1, text: 'Intrusion Detected' },
                { step: 2, text: 'Buzzer ON' },
                { step: 3, text: 'LED ON' },
                { step: 4, text: 'LCD ➔ "INTRUDER DETECTED"' },
                { step: 5, text: 'Servo ➔ Lock Position' }
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-2 rounded border flex justify-between items-center transition-all duration-300 ${
                    demoStep >= s.step
                      ? 'bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66]'
                      : 'bg-[#07080c] border-slate-950 text-slate-600'
                  }`}
                >
                  <span>STEP 0{s.step}: {s.text}</span>
                  {demoStep >= s.step && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              ))}
            </div>

            {/* Sim Logs */}
            {demoLog.length > 0 && (
              <div className="p-3 bg-black/60 rounded border border-slate-900 font-mono text-[9px] text-slate-400 space-y-1 max-h-[100px] overflow-y-auto">
                {demoLog.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSimulateDemo}
              disabled={isSimulating}
              className={`flex-1 py-2.5 font-display font-black text-xs uppercase rounded cursor-pointer ${
                isSimulating
                  ? 'bg-slate-900 border border-slate-800 text-slate-600'
                  : 'bg-[#00f0ff] text-black hover:bg-[#5ce1e6]'
              }`}
            >
              {isSimulating ? 'SIMULATING RESPONSE...' : '[ SIMULATE INTRUSION ]'}
            </button>
            {demoStep > 0 && !isSimulating && (
              <button
                onClick={handleResetDemo}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded text-xs cursor-pointer"
              >
                RESET
              </button>
            )}
          </div>
        </div>

        {/* Right: The Final Viva and questions */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-[#07080c]/80 space-y-4">
          <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#a855f7]">
            <HelpCircle className="w-4 h-4 text-[#a855f7]" /> THE FINAL VIVA DEFENSE
          </h4>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            The Final Jury challenges the squad on engineering choices immediately following the live system demonstration.
          </p>

          <div className="space-y-3">
            {[
              { q: 'Why a relay was used?', a: 'To isolate low-voltage microcontroller logic from high-voltage load lines (safety barrier).' },
              { q: 'What happens if resistor values change?', a: 'Directly impacts current limits, sensor analog voltage dividers, and LED brightness metrics.' },
              { q: 'How the project could be improved?', a: 'Integration of persistent flash memory logs and redundant power configurations.' }
            ].map((v, i) => (
              <div key={i} className="p-3 bg-[#050609] border border-slate-950 rounded text-left">
                <span className="text-[9px] font-bold text-[#a855f7] block uppercase">// VIVA SAMPLE TOPIC 0{i+1}:</span>
                <strong className="text-white text-xs font-sans block mt-0.5">{v.q}</strong>
                <p className="text-slate-400 text-[10px] font-sans mt-1 leading-normal">{v.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Championship Scoring Framework Breakdown */}
      <div className="glass-panel p-6 rounded-xl border border-[#ffb700]/40 hud-box bg-gradient-to-br from-[#0e111a] to-[#07080c]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h4 className="font-display font-bold text-lg text-white uppercase">
              Championship Score Breakdown
            </h4>
            <span className="text-xs font-mono text-slate-400">OFFICIAL 100-MARK SCHEME</span>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black font-display text-white text-glow-orange">100 MARKS</span>
            <span className="block text-[9px] font-mono text-slate-400">TOTAL EVALUATION</span>
          </div>
        </div>

        {/* Scoring Bars */}
        <div className="space-y-5">
          {criteria.map((c, idx) => (
            <div key={idx} className="space-y-1.5 font-mono">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-200">{c.label}</span>
                <span className="font-bold" style={{ color: c.color }}>{c.weight} MARKS</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">{c.description}</p>

              <div className="w-full h-2.5 bg-[#07080c] border border-slate-800 rounded overflow-hidden p-0.5">
                <div
                  className="h-full rounded-sm transition-all duration-1000 ease-out"
                  style={{
                    width: `${c.weight * 5}%`,
                    backgroundColor: c.color,
                    boxShadow: `0 0 10px ${c.color}`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default Stage4Showdown;
