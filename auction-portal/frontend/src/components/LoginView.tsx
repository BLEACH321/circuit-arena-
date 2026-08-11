import React, { useState } from 'react';
import { Shield, Users, Monitor, Lock, Key, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  teams: any[];
  onLogin: (role: 'admin' | 'projector' | 'team', refId?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ teams, onLogin }) => {
  const [mode, setMode] = useState<'select' | 'team' | 'admin'>('select');
  const [refIdInput, setRefIdInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = refIdInput.trim().toUpperCase();
    if (!cleanId) return;

    // Verify if teams list is uploaded, if so, validate
    if (teams.length > 0) {
      const match = teams.find(t => t.refId === cleanId);
      if (!match) {
        setError('Reference ID not found. Verify with your team captain.');
        return;
      }
    }

    setError('');
    onLogin('team', cleanId);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'arena2026') {
      setError('');
      onLogin('admin');
    } else {
      setError('Invalid passcode.');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-grid bg-[#050508] flex items-center justify-center px-4 py-12 relative overflow-hidden font-mono">
      {/* Laser flare overlay */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff6b00]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full glass-panel border border-slate-800/80 p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] hud-box relative z-10 space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#0e111a] border border-[#ff6b00] rounded-xl flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(255,107,0,0.25)]">
            <Shield className="w-8 h-8 text-[#ff6b00]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-widest text-white uppercase">
              CIRCUIT <span className="text-[#ff6b00] text-glow-orange">ARENA</span>
            </h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              // LIVE AUCTION TELEMETRY OS
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-[#ff1a40]/10 border border-[#ff1a40]/30 text-[#ff1a40] text-xs p-3.5 rounded text-center font-bold">
            ERROR: {error}
          </div>
        )}

        {/* ROLE SELECTION SCREEN */}
        {mode === 'select' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('team')}
              className="w-full p-4 bg-[#0e111a] hover:bg-[#ff6b00]/10 border border-slate-800 hover:border-[#ff6b00] text-left rounded-xl transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-[#ff6b00]/50 transition-colors">
                  <Users className="w-5 h-5 text-[#ff6b00]" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white uppercase font-display tracking-wider">TEAM BIDDING PORTAL</span>
                  <span className="block text-[9px] text-slate-500 font-sans mt-0.5">Enter with your Reference ID to bid.</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#ff6b00] transition-colors" />
            </button>

            <button
              onClick={() => onLogin('projector')}
              className="w-full p-4 bg-[#0e111a] hover:bg-[#00f0ff]/10 border border-slate-800 hover:border-[#00f0ff] text-left rounded-xl transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-[#00f0ff]/50 transition-colors">
                  <Monitor className="w-5 h-5 text-[#00f0ff]" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white uppercase font-display tracking-wider">PROJECTOR DISPLAY</span>
                  <span className="block text-[9px] text-slate-500 font-sans mt-0.5">Main stage widescreen visualizer.</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#00f0ff] transition-colors" />
            </button>

            <button
              onClick={() => setMode('admin')}
              className="w-full p-4 bg-[#0e111a] hover:bg-[#ff1a40]/10 border border-slate-800 hover:border-[#ff1a40] text-left rounded-xl transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-[#ff1a40]/50 transition-colors">
                  <Lock className="w-5 h-5 text-[#ff1a40]" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white uppercase font-display tracking-wider">ORGANIZER CONSOLE</span>
                  <span className="block text-[9px] text-slate-500 font-sans mt-0.5">Control panel for starting auctions.</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#ff1a40] transition-colors" />
            </button>
          </div>
        )}

        {/* TEAM LOGIN FORM */}
        {mode === 'team' && (
          <form onSubmit={handleTeamSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TEAM REFERENCE ID</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. CA-001"
                  value={refIdInput}
                  onChange={(e) => setRefIdInput(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-[#07080c] border border-slate-800 focus:border-[#ff6b00] rounded text-sm text-white font-mono placeholder-slate-600 outline-none uppercase"
                />
              </div>
              {teams.length === 0 && (
                <span className="text-[9px] text-yellow-500 font-sans block mt-1">
                  * Note: Teams list has not been loaded by the admin yet. You can log in with any ID as a mockup.
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="w-1/3 py-3 bg-[#0e111a] border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-bold uppercase rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-[#ff6b00] hover:bg-[#ff851b] text-black font-display font-black text-xs uppercase rounded tracking-wider shadow-[0_0_15px_rgba(255,107,0,0.3)]"
              >
                ACCESS TELEMETRY
              </button>
            </div>
          </form>
        )}

        {/* ADMIN PASSCODE FORM */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CONSOLE PASSCODE</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-[#07080c] border border-slate-800 focus:border-[#ff1a40] rounded text-sm text-white font-mono placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="w-1/3 py-3 bg-[#0e111a] border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-bold uppercase rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-[#ff1a40] hover:bg-[#ff4d6d] text-white font-display font-black text-xs uppercase rounded tracking-wider shadow-[0_0_15px_rgba(255,26,64,0.3)]"
              >
                DECRYPT CONSOLE
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
export default LoginView;
