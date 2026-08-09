import React, { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Step3Props {
  formData: {
    teamName: string;
    college: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    teamSize: number;
  };
  isSubmitting: boolean;
  onPrev: () => void;
  onConfirm: () => void;
}

export const Step3Confirmation: React.FC<Step3Props> = ({
  formData,
  isSubmitting,
  onPrev,
  onConfirm
}) => {
  const [agreed, setAgreed] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string>('');

  const handleSubmit = () => {
    if (!agreed) {
      setLocalError('You must accept the official arena rulebook directives to confirm.');
      return;
    }
    setLocalError('');
    onConfirm();
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-3 text-left">
        <span className="text-xs font-mono text-[#00ff66] uppercase tracking-widest">[ STEP 03 / 03 ]</span>
        <h3 className="text-xl font-bold font-display text-white uppercase mt-1">
          MISSION CONFIRMATION
        </h3>
        <p className="text-xs font-mono text-slate-400">VERIFY ARENA SQUAD DIRECTIVES</p>
      </div>

      {/* Summary Box */}
      <div className="glass-panel p-6 rounded-lg border border-[#00ff66]/30 hud-box space-y-4 text-left font-mono text-xs">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="font-display font-extrabold text-base text-white">{formData.teamName}</span>
          <span className="text-[#00ff66] font-bold bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">
            SQUAD READY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block text-[10px]">COLLEGE / INSTITUTE:</span>
            <span className="text-slate-200 font-bold">{formData.college}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">TEAM LEADER:</span>
            <span className="text-slate-200 font-bold">{formData.leaderName}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">TEAM SIZE:</span>
            <span className="text-[#00f0ff] font-bold">{formData.teamSize} PARTICIPANTS</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">STARTING VIRTUAL BUDGET:</span>
            <span className="text-[#ffb700] font-bold">2000 POINTS</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase mb-1">COMPETITION MISSION STATEMENT:</span>
          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            Enter the arena, manage your component resources, design your schematic circuit, build your hardware solution, and defend your engineering decisions under judge panel defense.
          </p>
        </div>

      </div>

      {/* Agreement Checkbox */}
      <div className="p-4 bg-[#07080c] border border-slate-800 rounded-lg text-left">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              sound.playClick();
              setAgreed(e.target.checked);
              if (e.target.checked) setLocalError('');
            }}
            className="mt-0.5 w-4 h-4 accent-[#00ff66] rounded cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-200 leading-normal">
            I have read and agree to the official event rules, safety guidelines, component usage constraints, and scoring directives of CIRCUIT ARENA.
          </span>
        </label>
        {localError && (
          <p className="text-red-400 text-xs font-mono mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {localError}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#07080c] border border-slate-700 text-slate-300 font-mono text-xs rounded hover:border-slate-500"
        >
          &lt; BACK TO ROSTER
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-gradient-to-r from-[#00ff66] to-[#00f0ff] text-black font-display font-black text-xs uppercase rounded transition-all shadow-[0_0_20px_rgba(0,255,102,0.5)] hover:scale-105"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> ENCRYPTING REGISTRATION...
            </span>
          ) : (
            '## CONFIRM REGISTRATION'
          )}
        </button>
      </div>

    </div>
  );
};
