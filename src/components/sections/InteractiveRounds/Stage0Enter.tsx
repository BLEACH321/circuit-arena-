import React, { useState } from 'react';
import { Lock, Clock, Sparkles, Calendar, CheckCircle2, ArrowRight, LogOut, Key, Users } from 'lucide-react';
import { useArena } from '../../../context/ArenaContext';
import { sound } from '../../../utils/sound';

export const Stage0Enter: React.FC = () => {
  const { countdownTarget, arenaOpen, registeredTeam, setRegisteredTeam, teams, openRegistrationModal } = useArena();
  const [teamIdInput, setTeamIdInput] = useState<string>('');
  const [checkInError, setCheckInError] = useState<string>('');

  const formatDate = (ts: string | number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (!teamIdInput.trim()) return;

    const foundTeam = teams.find(
      t => t.teamId.toLowerCase() === teamIdInput.trim().toLowerCase()
    );

    if (foundTeam) {
      sound.playSuccess();
      setRegisteredTeam(foundTeam);
      setCheckInError('');
      setTeamIdInput('');
    } else {
      setCheckInError('TEAM ID NOT FOUND. Verify spelling or register a new team.');
    }
  };

  const handleLogoutSquad = () => {
    sound.playClick();
    setRegisteredTeam(null);
  };

  // 1. LOCKED MODE (Closed by Admin)
  if (!arenaOpen) {
    return (
      <div className="space-y-8 text-left font-mono animate-fade-in">
        {/* Stage Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest">[ STAGE 0 ]</span>
            <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
              ENTER THE ARENA
            </h3>
            <p className="text-xs font-mono text-[#ff6b00] tracking-widest mt-1">
              SQUAD ENROLLMENT • ARENA PROTOCOL
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#07080c] border border-[#ff6b00]/60 rounded text-[#ff6b00] text-xs font-bold">
            <Lock className="w-4 h-4 text-[#ff6b00] animate-pulse" />
            <span>LOCKED — COMING SOON</span>
          </div>
        </div>

        {/* LOCKED COMING SOON ARENA ENTRY PANEL */}
        <div className="glass-panel p-8 sm:p-14 rounded-2xl border-2 border-[#ff6b00]/60 hud-box bg-gradient-to-b from-[#121624] to-[#07080c] text-center space-y-6 shadow-[0_0_40px_rgba(255,107,0,0.25)] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-20 h-20 bg-[#07080c] border-2 border-[#ff6b00] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,107,0,0.4)] animate-pulse relative z-10">
            <Lock className="w-10 h-10 text-[#ff6b00]" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07080c] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-bold uppercase rounded">
              <Sparkles className="w-3.5 h-3.5 text-[#ffb700] animate-spin" />
              OFFICIAL ARENA PROTOCOL
            </div>
            <h4 className="text-3xl sm:text-4xl font-black font-display text-white uppercase tracking-wider">
              ARENA ENTRY PROTOCOL <span className="text-[#ff6b00] text-glow-orange">LOCKED</span>
            </h4>
          </div>

          <p className="text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto leading-relaxed relative z-10">
            This Stage 0 Arena Protocol will be officially unlocked and revealed live on the day of the event (<strong className="text-[#00f0ff]">{formatDate(countdownTarget)}</strong>). Squads registered via the official registration portal will receive their live check-in credentials upon unlock.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#07080c] border border-slate-800 rounded-xl text-xs relative z-10">
            <Calendar className="w-4 h-4 text-[#00ff66]" />
            <span className="text-slate-400">REVEALS ON EVENT DAY:</span>
            <span className="text-[#00ff66] font-bold font-display text-sm">{formatDate(countdownTarget)}</span>
          </div>

          <div className="pt-4 border-t border-slate-800/80 max-w-md mx-auto flex items-center justify-center gap-2 text-slate-400 text-xs relative z-10">
            <Clock className="w-4 h-4 text-[#ffb700] animate-pulse" />
            <span>ARENA COUNTDOWN RUNNING • PREPARE YOUR SQUAD</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED STATE - CHECKED IN
  if (registeredTeam) {
    return (
      <div className="space-y-8 text-left font-mono animate-fade-in">
        {/* Stage Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-[#00ff66] uppercase tracking-widest">[ STAGE 0 ]</span>
            <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
              SQUAD DASHBOARD
            </h3>
            <p className="text-xs font-mono text-[#00f0ff] tracking-widest mt-1">
              TELEMETRY CONNECTION SECURED
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff66]/10 border border-[#00ff66]/60 rounded text-[#00ff66] text-xs font-bold shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
            <span>ARENA UNLOCKED — ACTIVE</span>
          </div>
        </div>

        {/* Squad Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-[#00ff66]/30 bg-gradient-to-b from-[#121624]/60 to-[#07080c] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00f0ff]" />
                <h4 className="font-display font-extrabold text-white text-base uppercase">
                  {registeredTeam.teamName}
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 font-bold">
                {registeredTeam.teamId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">COLLEGE / INSTITUTE</span>
                <span className="text-slate-200 font-bold">{registeredTeam.college}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">TEAM LEADER</span>
                <span className="text-slate-200 font-bold">{registeredTeam.leaderName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">SQUAD SIZE</span>
                <span className="text-slate-200 font-bold">{registeredTeam.teamSize} MEMBERS</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">REGISTRATION TIMESTAMP</span>
                <span className="text-slate-200 font-bold">
                  {new Date(registeredTeam.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[#ff6b00] font-bold text-[10px] block uppercase">ROSTER MEMBERS:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {registeredTeam.participants.map((p, idx) => (
                  <div key={idx} className="p-2 bg-[#07080c] border border-slate-800 rounded text-[11px] flex justify-between">
                    <span className="text-slate-200 font-bold">{p.name}</span>
                    <span className="text-slate-500">ID: {p.collegeId || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-[#0e111a] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ALLOCATED CAPITAL</span>
              <h5 className="font-display font-black text-4xl text-[#ffb700] text-glow-orange">
                2000 <span className="text-sm font-mono text-white">PTS</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Your virtual budget is pre-loaded and active. Proceed to Stage 1 to participate in the Live Auction and purchase hardware components.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleLogoutSquad}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                DISCONNECT SQUAD
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. UNLOCKED STATE - NOT CHECKED IN
  return (
    <div className="space-y-8 text-left font-mono animate-fade-in">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#00ff66] uppercase tracking-widest">[ STAGE 0 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            ENTER THE ARENA
          </h3>
          <p className="text-xs font-mono text-[#00f0ff] tracking-widest mt-1">
            GATEWAY ONLINE • AUTHENTICATION REQUIRED
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff66]/10 border border-[#00ff66]/60 rounded text-[#00ff66] text-xs font-bold shadow-[0_0_15px_rgba(0,255,102,0.2)]">
          <Sparkles className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <span>ARENA UNLOCKED — ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check in Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#00f0ff]/30 bg-[#0e111a] space-y-4">
          <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#00f0ff]">
            <Key className="w-4 h-4 text-[#00f0ff]" /> SQUAD CHECK-IN
          </h4>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Enter your official 12-digit Team ID (e.g. <code className="text-white font-bold bg-slate-900 px-1 rounded">CA-2026-001</code>) issued during registration to authorize your telemetry bridge.
          </p>

          <form onSubmit={handleCheckIn} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 uppercase font-bold">OFFICIAL TEAM ID</label>
              <input
                type="text"
                placeholder="CA-2026-XXX"
                value={teamIdInput}
                onChange={e => setTeamIdInput(e.target.value)}
                className="w-full p-3 bg-[#07080c] border border-slate-800 focus:border-[#00f0ff] rounded text-white tracking-widest font-bold uppercase outline-none text-xs"
              />
              {checkInError && <p className="text-red-400 text-[10px] font-mono mt-1">{checkInError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00f0ff] hover:bg-[#5ce1e6] text-black font-display font-extrabold text-xs uppercase rounded shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-1.5"
            >
              [ INITIALIZE BRIDGE ] <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Register CTA */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#ff6b00]/30 bg-gradient-to-b from-[#1a1311]/40 to-[#07080c] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase text-[#ff6b00]">
              NO ACTIVE SQUAD TICKET?
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              If your squad has not yet registered for Circuit Arena, you must complete the registration and obtain your ticket reference ID.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              openRegistrationModal();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-[#ff6b00] to-[#ff0055] text-black font-display font-black text-xs uppercase rounded shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            [ OPEN REGISTRATION GATEWAY ]
          </button>
        </div>
      </div>
    </div>
  );
};
