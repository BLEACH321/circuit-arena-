import React, { useState } from 'react';
import { Award, Sliders, Activity, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/sound';

export const ScoringDashboard: React.FC = () => {
  const [scores, setScores] = useState({
    auctionStrategy: 9,
    budgetManagement: 9,
    smartPurchasing: 8,
    circuitDesign: 18,
    innovation: 13,
    circuitImplementation: 18,
    technicalViva: 13
  });

  const total = Number((
    scores.auctionStrategy +
    scores.budgetManagement +
    scores.smartPurchasing +
    scores.circuitDesign +
    scores.innovation +
    scores.circuitImplementation +
    scores.technicalViva
  ).toFixed(1));

  const criteriaList = [
    { key: 'auctionStrategy', label: 'Auction Strategy', max: 10, weight: '10 Marks', color: '#ff6b00' },
    { key: 'budgetManagement', label: 'Budget Management', max: 10, weight: '10 Marks', color: '#ffaa00' },
    { key: 'smartPurchasing', label: 'Smart Purchasing Decisions', max: 10, weight: '10 Marks', color: '#00f0ff' },
    { key: 'circuitDesign', label: 'Circuit Design', max: 20, weight: '20 Marks', color: '#a855f7' },
    { key: 'innovation', label: 'Innovation', max: 15, weight: '15 Marks', color: '#38bdf8' },
    { key: 'circuitImplementation', label: 'Circuit Implementation', max: 20, weight: '20 Marks', color: '#00ff66' },
    { key: 'technicalViva', label: 'Technical Explanation & Viva', max: 15, weight: '15 Marks', color: '#ff2a5f' }
  ];

  const presets = [
    {
      name: '🏆 CHAMPIONSHIP SQUAD',
      scores: {
        auctionStrategy: 10,
        budgetManagement: 9.5,
        smartPurchasing: 9,
        circuitDesign: 19,
        innovation: 14,
        circuitImplementation: 19,
        technicalViva: 14.5
      }
    },
    {
      name: '⚡ HIGH-TIER QUALIFIER',
      scores: {
        auctionStrategy: 8.5,
        budgetManagement: 8.5,
        smartPurchasing: 8,
        circuitDesign: 16.5,
        innovation: 12,
        circuitImplementation: 17,
        technicalViva: 12.5
      }
    },
    {
      name: '🛡️ BALANCED STRATEGY',
      scores: {
        auctionStrategy: 7,
        budgetManagement: 7.5,
        smartPurchasing: 7,
        circuitDesign: 14,
        innovation: 10,
        circuitImplementation: 15,
        technicalViva: 10.5
      }
    }
  ];

  const handleSliderChange = (key: string, val: number) => {
    sound.playClick();
    setScores(prev => ({ ...prev, [key]: val }));
  };

  const applyPreset = (presetScores: typeof scores) => {
    sound.playClick();
    setScores(presetScores);
  };

  // Heptagon Radar Chart Calculations
  const radius = 75;
  const centerX = 100;
  const centerY = 100;
  const angleStep = (Math.PI * 2) / 7;

  const points = criteriaList.map((item, idx) => {
    const val = scores[item.key as keyof typeof scores];
    const pct = val / item.max;
    const angle = idx * angleStep - Math.PI / 2;
    const x = centerX + radius * pct * Math.cos(angle);
    const y = centerY + radius * pct * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridPoints = (levelPct: number) => {
    return criteriaList.map((_, idx) => {
      const angle = idx * angleStep - Math.PI / 2;
      const x = centerX + radius * levelPct * Math.cos(angle);
      const y = centerY + radius * levelPct * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <section id="scoring" className="py-24 px-4 relative z-10 font-mono">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#0e111a] border border-[#00ff66]/40 text-[#00ff66] text-xs tracking-widest uppercase rounded mb-4 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <Award className="w-4 h-4 text-[#ffb700]" />
            EVALUATION MATRIX
          </div>
          <h2 className="text-3xl sm:text-6xl font-black font-display text-white tracking-wide uppercase">
            FINAL <span className="text-[#00ff66] text-glow-green">SCORING</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
            Official 7-Tier Evaluation Weights totaling 100 Marks. Adjust the performance matrix sliders or select squad presets to calculate live composite score metrics.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="text-xs text-slate-400 font-bold uppercase mr-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" /> PRESETS:
            </span>
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.scores)}
                className="px-4 py-2 bg-[#0e111a] hover:bg-[#151928] border border-slate-700 hover:border-[#00ff66] text-slate-200 hover:text-[#00ff66] text-xs font-bold rounded-lg transition-all hover:scale-105 cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scoring Grid & Calculator Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Center: Interactive Criteria Sliders */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 hud-box text-left bg-gradient-to-b from-[#0e111a] to-[#07080c] flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00f0ff]" />
                PERFORMANCE WEIGHT CALCULATOR
              </h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">[ LIVE SIMULATOR ]</span>
            </div>

            <div className="space-y-5">
              {criteriaList.map((item) => {
                const val = scores[item.key as keyof typeof scores];
                const pct = Math.round((val / item.max) * 100);
                return (
                  <div key={item.key} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-200 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span className="font-bold font-display text-sm" style={{ color: item.color }}>
                        {val} / {item.max} PTS ({item.weight})
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max={item.max}
                        step="0.5"
                        value={val}
                        onChange={(e) => handleSliderChange(item.key, parseFloat(e.target.value))}
                        className="w-full h-2.5 bg-[#07080c] rounded-lg appearance-none cursor-pointer accent-[#ff6b00]"
                      />
                      <span className="text-xs text-slate-400 w-12 text-right font-bold">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Footer Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-[#00f0ff]">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> SQUAD CAPABILITY ANALYSIS: OK
              </span>
              <button
                onClick={() => applyPreset({ auctionStrategy: 9, budgetManagement: 9, smartPurchasing: 8, circuitDesign: 18, innovation: 13, circuitImplementation: 18, technicalViva: 13 })}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> RESET MATRIX
              </button>
            </div>

          </div>

          {/* Right: Radar Chart & Composite Score HUD Dial */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-[#00ff66]/40 hud-box bg-gradient-to-b from-[#0e111a] to-[#07080c] text-center flex flex-col items-center justify-between shadow-[0_0_35px_rgba(0,255,102,0.15)] space-y-6">
            
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Cpu className="w-4 h-4 text-[#00ff66]" /> SQUAD RADAR MATRIX
              </span>
              <span className="text-[10px] text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">
                7-TIER ANALYZER
              </span>
            </div>

            {/* SVG Heptagon Radar Matrix */}
            <div className="relative w-48 h-48 my-2 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                {/* Background Grid Levels */}
                {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
                  <polygon
                    key={idx}
                    points={gridPoints(level)}
                    fill="none"
                    stroke="#1c2236"
                    strokeWidth="1.5"
                    strokeDasharray={idx === 3 ? '0' : '2,2'}
                  />
                ))}

                {/* Axis Spokes */}
                {criteriaList.map((_, idx) => {
                  const angle = idx * angleStep - Math.PI / 2;
                  const x = centerX + radius * Math.cos(angle);
                  const y = centerY + radius * Math.sin(angle);
                  return (
                    <line
                      key={idx}
                      x1={centerX}
                      y1={centerY}
                      x2={x}
                      y2={y}
                      stroke="#1c2236"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Score Area Polygon */}
                <polygon
                  points={points}
                  fill="rgba(0, 255, 102, 0.25)"
                  stroke="#00ff66"
                  strokeWidth="2.5"
                  className="transition-all duration-300 ease-out"
                />

                {/* Glowing Nodes */}
                {criteriaList.map((item, idx) => {
                  const val = scores[item.key as keyof typeof scores];
                  const pct = val / item.max;
                  const angle = idx * angleStep - Math.PI / 2;
                  const x = centerX + radius * pct * Math.cos(angle);
                  const y = centerY + radius * pct * Math.sin(angle);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={item.color}
                      stroke="#07080c"
                      strokeWidth="1.5"
                      className="transition-all duration-300 ease-out"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Score Composite Badge */}
            <div className="w-full bg-[#07080c] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="text-left">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">COMPOSITE SCORE</span>
                <span className="text-3xl font-black font-display text-white text-glow-green">{total} <span className="text-xs text-slate-400 font-mono">/ 100 PTS</span></span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">QUALIFICATION</span>
                <span className="inline-block mt-1 px-3 py-1 bg-[#00ff66]/10 border border-[#00ff66]/40 rounded text-xs font-bold text-[#00ff66]">
                  {total >= 90 ? '🏆 CHAMPION TIER' : total >= 75 ? '⚡ HIGH QUALIFIER' : '🛡️ ARENA SQUAD'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
export default ScoringDashboard;
