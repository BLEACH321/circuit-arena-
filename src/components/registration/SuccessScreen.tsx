import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Cpu } from 'lucide-react';
import type { Team } from '../../types/arena';
import { sound } from '../../utils/sound';

interface SuccessProps {
  team: Team;
  onClose: () => void;
}

export const SuccessScreen: React.FC<SuccessProps> = ({ team, onClose }) => {
  useEffect(() => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b00', '#00f0ff', '#00ff66', '#ffb700']
      });
    } catch {
      // Ignore
    }
  }, []);

  const handleDownload = () => {
    sound.playClick();
    const content = `
=====================================================
            CIRCUIT ARENA 2026 - TICKET
=====================================================
TEAM ID:       ${team.teamId}
TEAM NAME:     ${team.teamName}
COLLEGE:       ${team.college}
TEAM LEADER:   ${team.leaderName} (${team.leaderEmail})
TEAM SIZE:     ${team.teamSize} PARTICIPANT(S)
START BUDGET:  2000 VIRTUAL PTS
STATUS:        CONFIRMED & APPROVED
DATE ISSUED:   ${new Date().toLocaleString()}
=====================================================
INSTRUCTIONS: Present this Team Ticket at Stage 0 check-in.
=====================================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TICKET_${team.teamId}_${team.teamName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-center">
      
      {/* Success Badge */}
      <div className="w-16 h-16 bg-[#00ff66]/10 border-2 border-[#00ff66] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,102,0.4)] animate-bounce">
        <CheckCircle2 className="w-10 h-10 text-[#00ff66]" />
      </div>

      <div>
        <span className="text-xs font-mono text-[#00ff66] tracking-widest uppercase">REGISTRATION CONFIRMED</span>
        <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
          WELCOME TO THE <span className="text-[#ff6b00] text-glow-orange">CIRCUIT ARENA</span>
        </h3>
      </div>

      {/* Futuristic Team Badge Ticket Visual */}
      <div className="glass-panel p-6 rounded-xl border-2 border-[#ff6b00] hud-box bg-gradient-to-b from-[#121624] to-[#07080c] text-left font-mono text-xs space-y-4 shadow-[0_0_30px_rgba(255,107,0,0.2)]">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#00f0ff]" />
            <span className="font-display font-extrabold text-sm text-white">ARENA SQUAD BADGE</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-[#00ff66]/20 text-[#00ff66] font-bold text-[10px]">
            ACTIVE ENTRY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#07080c] p-3 rounded border border-slate-800">
            <span className="text-slate-400 block text-[9px]">OFFICIAL TEAM ID</span>
            <span className="text-xl font-bold font-display text-[#00f0ff] text-glow-cyan">{team.teamId}</span>
          </div>

          <div className="bg-[#07080c] p-3 rounded border border-slate-800">
            <span className="text-slate-400 block text-[9px]">TEAM NAME</span>
            <span className="text-base font-bold font-display text-white">{team.teamName}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px]">SQUAD SIZE</span>
            <span className="text-slate-200 font-bold">{team.teamSize} MEMBERS</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px]">TEAM LEADER</span>
            <span className="text-slate-200 font-bold">{team.leaderName}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
          <span>ALLOCATED BUDGET: 2000 PTS</span>
          <span>COLLEGE: {team.college}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-6 py-3 bg-[#0e111a] border border-[#00f0ff] hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-display font-bold text-xs uppercase rounded transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          [ DOWNLOAD REGISTRATION TICKET ]
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full sm:w-auto px-8 py-3 bg-[#ff6b00] hover:bg-[#ff851b] text-black font-display font-black text-xs uppercase rounded transition-all shadow-[0_0_15px_rgba(255,107,0,0.5)]"
        >
          [ BACK TO ARENA ]
        </button>
      </div>

    </div>
  );
};
