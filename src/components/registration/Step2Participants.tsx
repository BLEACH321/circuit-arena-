import React from 'react';
import { User, AlertCircle } from 'lucide-react';
import type { Participant } from '../../types/arena';

interface Step2Props {
  teamSize: number;
  participants: Participant[];
  errors: Record<string, string>;
  onChangeParticipant: (index: number, field: keyof Participant, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2Participants: React.FC<Step2Props> = ({
  teamSize,
  participants,
  errors,
  onChangeParticipant,
  onPrev,
  onNext
}) => {
  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-3 text-left">
        <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest">[ STEP 02 / 03 ]</span>
        <h3 className="text-xl font-bold font-display text-white uppercase mt-1">
          PARTICIPANT ROSTER DATA
        </h3>
        <p className="text-xs font-mono text-slate-400">
          ENTER CREDENTIALS FOR {teamSize} {teamSize === 1 ? 'MEMBER' : 'MEMBERS'}
        </p>
      </div>

      {/* Dynamic Participant Cards */}
      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
        {Array.from({ length: teamSize }).map((_, idx) => {
          const isLeader = idx === 0;
          const p = participants[idx] || { name: '', email: '', phone: '', collegeId: '' };

          return (
            <div
              key={idx}
              className={`p-5 rounded-lg border text-left font-mono text-xs ${
                isLeader
                  ? 'bg-[#00f0ff]/5 border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                  : 'bg-[#07080c] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <User className={`w-4 h-4 ${isLeader ? 'text-[#00f0ff]' : 'text-slate-400'}`} />
                  {isLeader ? 'PARTICIPANT 1 (TEAM LEADER) *' : `PARTICIPANT ${idx + 1}`}
                </span>
                {isLeader && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-bold">
                    LEAD CONTACT
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">
                    FULL NAME {isLeader && '*'}
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={p.name}
                    onChange={(e) => onChangeParticipant(idx, 'name', e.target.value)}
                    className={`w-full p-2.5 bg-[#07080c] border ${
                      errors[`p_${idx}_name`] ? 'border-red-500' : 'border-slate-800 focus:border-[#00f0ff]'
                    } rounded text-white outline-none`}
                  />
                  {errors[`p_${idx}_name`] && (
                    <p className="text-red-400 text-[9px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors[`p_${idx}_name`]}
                    </p>
                  )}
                </div>

                {/* College ID / Roll Number */}
                <div>
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">
                    COLLEGE ID / ROLL NO {isLeader && '*'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2023-CS-041"
                    value={p.collegeId}
                    onChange={(e) => onChangeParticipant(idx, 'collegeId', e.target.value)}
                    className={`w-full p-2.5 bg-[#07080c] border ${
                      errors[`p_${idx}_collegeId`] ? 'border-red-500' : 'border-slate-800 focus:border-[#00f0ff]'
                    } rounded text-white outline-none`}
                  />
                  {errors[`p_${idx}_collegeId`] && (
                    <p className="text-red-400 text-[9px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors[`p_${idx}_collegeId`]}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">
                    EMAIL ADDRESS {isLeader && '*'}
                  </label>
                  <input
                    type="email"
                    placeholder="email@college.edu"
                    value={p.email}
                    onChange={(e) => onChangeParticipant(idx, 'email', e.target.value)}
                    className={`w-full p-2.5 bg-[#07080c] border ${
                      errors[`p_${idx}_email`] ? 'border-red-500' : 'border-slate-800 focus:border-[#00f0ff]'
                    } rounded text-white outline-none`}
                  />
                  {errors[`p_${idx}_email`] && (
                    <p className="text-red-400 text-[9px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors[`p_${idx}_email`]}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">
                    PHONE NUMBER {isLeader && '*'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 555-0000"
                    value={p.phone}
                    onChange={(e) => onChangeParticipant(idx, 'phone', e.target.value)}
                    className={`w-full p-2.5 bg-[#07080c] border ${
                      errors[`p_${idx}_phone`] ? 'border-red-500' : 'border-slate-800 focus:border-[#00f0ff]'
                    } rounded text-white outline-none`}
                  />
                  {errors[`p_${idx}_phone`] && (
                    <p className="text-red-400 text-[9px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors[`p_${idx}_phone`]}
                    </p>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-[#07080c] border border-slate-700 text-slate-300 font-mono text-xs rounded hover:border-slate-500"
        >
          &lt; BACK TO STEP 1
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3 bg-[#00f0ff] hover:bg-[#5ce1e6] text-black font-display font-extrabold text-xs uppercase rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          [ PROCEED TO CONFIRMATION &gt; ]
        </button>
      </div>

    </div>
  );
};
