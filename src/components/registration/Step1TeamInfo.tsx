import React from 'react';
import { AlertCircle } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Step1Props {
  formData: {
    teamName: string;
    college: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    teamSize: number;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}

export const Step1TeamInfo: React.FC<Step1Props> = ({
  formData,
  errors,
  onChange,
  onNext
}) => {
  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-3 text-left">
        <span className="text-xs font-mono text-[#ff6b00] uppercase tracking-widest">[ STEP 01 / 03 ]</span>
        <h3 className="text-xl font-bold font-display text-white uppercase mt-1">
          TEAM IDENTIFICATION
        </h3>
        <p className="text-xs font-mono text-slate-400">CREATE YOUR COMPETITION SQUAD</p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono text-xs">
        
        {/* Team Name */}
        <div>
          <label className="block text-slate-300 mb-1.5 uppercase font-bold">TEAM NAME *</label>
          <input
            type="text"
            placeholder="e.g. CYBER VOLT"
            value={formData.teamName}
            onChange={(e) => onChange('teamName', e.target.value)}
            className={`w-full p-3 bg-[#07080c] border ${errors.teamName ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none transition-colors`}
          />
          {errors.teamName && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.teamName}</p>}
        </div>

        {/* College / Institute */}
        <div>
          <label className="block text-slate-300 mb-1.5 uppercase font-bold">COLLEGE / INSTITUTE *</label>
          <input
            type="text"
            placeholder="e.g. Stanford Tech Institute"
            value={formData.college}
            onChange={(e) => onChange('college', e.target.value)}
            className={`w-full p-3 bg-[#07080c] border ${errors.college ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none transition-colors`}
          />
          {errors.college && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.college}</p>}
        </div>

        {/* Team Leader Name */}
        <div>
          <label className="block text-slate-300 mb-1.5 uppercase font-bold">TEAM LEADER NAME *</label>
          <input
            type="text"
            placeholder="e.g. Alex Mercer"
            value={formData.leaderName}
            onChange={(e) => onChange('leaderName', e.target.value)}
            className={`w-full p-3 bg-[#07080c] border ${errors.leaderName ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none transition-colors`}
          />
          {errors.leaderName && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.leaderName}</p>}
        </div>

        {/* Team Leader Email */}
        <div>
          <label className="block text-slate-300 mb-1.5 uppercase font-bold">LEADER EMAIL *</label>
          <input
            type="email"
            placeholder="e.g. alex@college.edu"
            value={formData.leaderEmail}
            onChange={(e) => onChange('leaderEmail', e.target.value)}
            className={`w-full p-3 bg-[#07080c] border ${errors.leaderEmail ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none transition-colors`}
          />
          {errors.leaderEmail && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.leaderEmail}</p>}
        </div>

        {/* Team Leader Phone */}
        <div className="md:col-span-2">
          <label className="block text-slate-300 mb-1.5 uppercase font-bold">LEADER PHONE NUMBER *</label>
          <input
            type="tel"
            placeholder="e.g. +1 555-0192"
            value={formData.leaderPhone}
            onChange={(e) => onChange('leaderPhone', e.target.value)}
            className={`w-full p-3 bg-[#07080c] border ${errors.leaderPhone ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none transition-colors`}
          />
          {errors.leaderPhone && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.leaderPhone}</p>}
        </div>

      </div>

      {/* Team Size Selector */}
      <div className="pt-2">
        <label className="block text-slate-300 text-xs font-mono uppercase font-bold mb-2 text-left">
          SELECT SQUAD SIZE:
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                sound.playClick();
                onChange('teamSize', size);
              }}
              className={`p-3 rounded border font-mono text-xs font-bold transition-all ${
                formData.teamSize === size
                  ? 'bg-[#ff6b00] text-black border-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.4)]'
                  : 'bg-[#07080c] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {size} {size === 1 ? 'MEMBER' : 'MEMBERS'}
            </button>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3 bg-[#ff6b00] hover:bg-[#ff851b] text-black font-display font-extrabold text-xs uppercase rounded transition-all shadow-[0_0_15px_rgba(255,107,0,0.4)]"
        >
          [ PROCEED TO PARTICIPANTS DATA &gt; ]
        </button>
      </div>

    </div>
  );
};
