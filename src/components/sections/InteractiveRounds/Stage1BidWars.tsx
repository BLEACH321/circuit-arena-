import React, { useState, useEffect } from 'react';
import { Key, ArrowRight } from 'lucide-react';
import { sound } from '../../../utils/sound';
import { useArena } from '../../../context/ArenaContext';
import { TeamPortal } from '../../auction/TeamPortal';
import { io } from 'socket.io-client';

const socketUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://circuit-arena-bids.onrender.com';

const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  autoConnect: false
});

export const Stage1BidWars: React.FC = () => {
  const { registeredTeam, setRegisteredTeam, teams } = useArena();
  const [teamIdInput, setTeamIdInput] = useState<string>('');
  const [checkInError, setCheckInError] = useState<string>('');

  // Synced auction states
  const [auctionTeams, setAuctionTeams] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    if (registeredTeam) {
      if (!socket.connected) {
        socket.connect();
      }
    }
  }, [registeredTeam]);

  useEffect(() => {
    const handleStateUpdate = (data: any) => {
      if (data.teams) setAuctionTeams(data.teams);
      setActiveItem(data.activeItem);
    };

    socket.on('state_update', handleStateUpdate);
    return () => {
      socket.off('state_update', handleStateUpdate);
    };
  }, []);

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
      setCheckInError('TEAM ID NOT FOUND. Verify spelling.');
    }
  };

  return (
    <div className="space-y-6 text-left font-mono">
      {registeredTeam ? (
        <TeamPortal
          socket={socket}
          refId={registeredTeam.teamId}
          teams={auctionTeams}
          activeItem={activeItem}
        />
      ) : (
        <div className="max-w-md mx-auto text-left py-12">
          {/* Check in Form */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#00f0ff]/30 bg-[#0e111a] space-y-4">
            <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#00f0ff]">
              <Key className="w-4 h-4 text-[#00f0ff]" /> SQUAD CHECK-IN
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Enter your official Team ID (e.g. <code className="text-white font-bold bg-slate-900 px-1.5 py-0.5 rounded">CA-2026-101</code>) to authorize your live auction telemetry bridge.
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
                className="w-full py-3 bg-[#00f0ff] hover:bg-[#5ce1e6] text-black font-display font-extrabold text-xs uppercase rounded shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                [ INITIALIZE BRIDGE ] <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stage1BidWars;
