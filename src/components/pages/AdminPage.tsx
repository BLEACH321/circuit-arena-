import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { useArena } from '../../context/ArenaContext';
import { sound } from '../../utils/sound';
import { AdminDashboard } from '../admin/AdminDashboard';

export const AdminPage: React.FC = () => {
  const { loginAdmin, isAdmin } = useArena();
  const [passkey, setPasskey] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const success = loginAdmin(passkey);
    if (success) {
      sound.playSuccess();
      setError('');
    } else {
      setError('INVALID ORGANIZER PASSKEY. Use default "admin123".');
    }
  };

  const handleBackToHome = () => {
    sound.playClick();
    window.location.hash = '#home';
  };

  // If already logged in, render the full admin dashboard natively on this page
  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-4 relative overflow-hidden scanline-overlay">
      
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff1a40]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff0055]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Login Box */}
      <div className="w-full max-w-md bg-[#0e111a]/90 border border-slate-900 rounded-3xl p-6 sm:p-8 relative z-10 shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
        
        {/* Cyber corner details */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff1a40] rounded-tl-md opacity-55" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff1a40] rounded-tr-md opacity-55" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff1a40] rounded-bl-md opacity-55" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff1a40] rounded-br-md opacity-55" />

        {/* Back Link */}
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors font-mono text-[10px] uppercase mb-6 tracking-widest cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6 text-left">
          <div className="p-2 bg-[#ff1a40]/10 border border-[#ff1a40]/30 rounded-xl text-[#ff1a40]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-white tracking-widest uppercase">
              ORGANIZER PORTAL
            </h3>
            <span className="block text-[9px] font-mono tracking-widest text-[#ff758f] uppercase opacity-75">
              SECURE ADMIN SESSION
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs text-left">
          <div>
            <label className="block text-slate-400 uppercase font-black mb-2 tracking-wider">
              ENTER ORGANIZER PASSKEY
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Passkey (default: admin123)"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full p-3 bg-[#050508] border border-slate-800 focus:border-[#ff1a40]/60 rounded-xl text-white outline-none pl-10 focus:shadow-[0_0_15px_rgba(255,26,64,0.1)] transition-all font-mono"
              />
              <KeyRound className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
            </div>
            {error && (
              <p className="text-red-400 text-[10px] mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                {error}
              </p>
            )}
          </div>

          <div className="p-4 bg-[#ff1a40]/5 border border-[#ff1a40]/15 rounded-2xl text-[11px] text-slate-400 leading-relaxed">
            <span className="text-[#ff1a40] font-black block mb-1 uppercase tracking-wide">
              DEFAULT ORGANIZER PASSKEY:
            </span>
            Input <code className="bg-black/60 px-1.5 py-0.5 rounded text-[#00ff66] font-bold">admin123</code> to access the live dashboard control center.
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#ff1a40] hover:bg-[#ff4d6d] text-white font-display font-black text-xs uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(255,26,64,0.3)] cursor-pointer"
            >
              UNLOCK CONTROL CENTER
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminPage;
