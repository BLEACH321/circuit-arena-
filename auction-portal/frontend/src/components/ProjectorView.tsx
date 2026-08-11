import React, { useState, useEffect } from 'react';
import { Gavel, Clock, Trophy, Users, MonitorOff, Bell } from 'lucide-react';

interface ProjectorViewProps {
  socket: any;
  teams: any[];
  catalogue: any[];
  activeItem: any;
  onLogout: () => void;
}

export const ProjectorView: React.FC<ProjectorViewProps> = ({
  socket,
  teams,
  activeItem,
  onLogout
}) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    itemName: string;
    buyerName: string;
    price: number;
  } | null>(null);

  // Monitor announcements
  useEffect(() => {
    const handleAnnounce = (ann: any) => {
      // Append announcement
      setAnnouncements(prev => [
        { id: Date.now(), text: ann.message, type: ann.type },
        ...prev.slice(0, 4)
      ]);

      // If item sold, trigger full-screen celebration
      if (ann.type === 'SOLD') {
        setCelebration({
          show: true,
          itemName: ann.itemName,
          buyerName: ann.buyerName,
          price: ann.price
        });
        
        // Hide celebration overlay after 7 seconds
        setTimeout(() => setCelebration(null), 7000);
      }
    };

    socket.on('auction_announcement', handleAnnounce);
    return () => {
      socket.off('auction_announcement', handleAnnounce);
    };
  }, [socket]);

  const currentItem = activeItem?.item;
  const timer = activeItem?.timer || 0;

  // Sort teams by remaining budget or items bought for leaderboard feel
  const sortedTeams = [...teams].sort((a, b) => b.inventory.length - a.inventory.length || b.budget - a.budget);

  return (
    <div className="min-h-screen bg-[#030305] text-slate-100 font-mono text-left p-6 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Cyber Blue Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-[0.06] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff6b00]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* HEADER BAR */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black border border-[#ff6b00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.3)]">
            <Trophy className="w-6 h-6 text-[#ff6b00] animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-wider text-white">
              CIRCUIT <span className="text-[#ff6b00] text-glow-orange">ARENA</span>
            </h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block mt-0.5">
              // OFFICIAL TELEMETRY SCREEN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase block">SYSTEM CLOCK</span>
            <span className="text-xs font-bold text-white uppercase">{new Date().toLocaleTimeString()}</span>
          </div>
          <button
            onClick={onLogout}
            title="Exit Projector Mode"
            className="p-2 bg-[#0e111a] border border-slate-900 hover:border-red-500 rounded text-slate-600 hover:text-red-500 transition-colors"
          >
            <MonitorOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN SCREEN AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 my-6 flex-1 items-stretch z-10">
        
        {/* LEFT COLUMN: ACTIVE AUCTION (Takes 3 cols on wide screens) */}
        <div className="xl:col-span-3 flex flex-col justify-between space-y-6">
          
          <div className="glass-panel p-8 rounded-2xl border-2 border-slate-900/80 shadow-2xl flex-1 flex flex-col justify-between relative min-h-[400px]">
            {/* HUD Corner Decals */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff6b00]/70" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff6b00]/70" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff6b00]/70" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff6b00]/70" />

            {!activeItem ? (
              <div className="m-auto text-center space-y-4">
                <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Gavel className="w-10 h-10 text-slate-600 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-lg uppercase tracking-widest">AUCTION PROTOCOL: STAGE 1</h3>
                  <p className="text-slate-400 font-sans text-xs max-w-sm mx-auto mt-2 leading-relaxed">
                    Welcome to the Component Battle. Awaiting next telemetry command to unlock the active component.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between space-y-8">
                
                {/* Upper active item banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-[10px] text-[#ff6b00] uppercase font-bold tracking-widest block bg-[#ff6b00]/10 px-3 py-1 border border-[#ff6b00]/30 rounded-full w-max mb-3">
                      {currentItem.category}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider text-glow-orange">
                      {currentItem.name}
                    </h2>
                    <div className="flex gap-6 mt-3 text-slate-400 font-mono text-xs">
                      <span>BASE VALUE: <strong className="text-white">{currentItem.basePrice} COINS</strong></span>
                      <span>INCREMENTS: <strong className="text-white">+{currentItem.minIncrement} COINS</strong></span>
                    </div>
                  </div>

                  {/* Gigantic Digital Countdown Timer */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center min-w-[140px] shadow-lg">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-widest">BID WINDOW</span>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Clock className={`w-6 h-6 ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-[#00f0ff]'}`} />
                      <span className={`text-5xl font-display font-black tracking-tighter ${
                        timer <= 5 ? 'text-red-500 text-glow-red animate-pulse' : 'text-[#00f0ff] text-glow-cyan'
                      }`}>
                        {timer}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Central Bidding Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* High bid price */}
                  <div className="bg-gradient-to-r from-amber-950/20 to-orange-950/20 p-6 rounded-2xl border border-orange-500/30 flex flex-col justify-center min-h-[160px] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#ff6b00]/5 rounded-full blur-2xl pointer-events-none" />
                    <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold">CURRENT HIGHEST BID</span>
                    <span className="text-5xl sm:text-6xl font-black font-display text-amber-500 text-glow-orange block mt-2">
                      {currentItem.currentBid} <span className="text-lg font-mono text-white tracking-normal font-normal">COINS</span>
                    </span>
                  </div>

                  {/* Highest Bidder Details */}
                  <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-900 flex flex-col justify-center min-h-[160px] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00f0ff]/5 rounded-full blur-2xl pointer-events-none" />
                    <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold">HIGHEST BIDDER SQUAD</span>
                    {currentItem.highestBidder ? (
                      <div className="mt-3 space-y-1">
                        <strong className="text-xl sm:text-2xl font-display font-black text-[#00f0ff] text-glow-cyan block uppercase truncate">
                          {currentItem.highestBidderName}
                        </strong>
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
                          ROSTER ID: {currentItem.highestBidder}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-black text-slate-700 block mt-4 animate-pulse">
                        [ NO BIDS RECORDED ]
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom ticker log */}
                <div className="border-t border-slate-900 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Bell className="w-3.5 h-3.5 text-[#ff6b00]" /> TELEMETRY BROADCAST ACTIVE</span>
                  <span>INCREMENT VALUE: +{currentItem.minIncrement} Coins</span>
                </div>

              </div>
            )}
          </div>

          {/* Live scrolling announcement logs */}
          <div className="glass-panel p-4 rounded-xl border border-slate-900 h-[100px] flex flex-col justify-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold mb-2">LIVE ARENA COMMUNIQUÉS</span>
            <div className="space-y-1 overflow-hidden h-[60px] text-[10px]">
              {announcements.length === 0 ? (
                <div className="text-slate-800 italic">Static feedback loop... Standby.</div>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className={`flex items-center gap-2 font-mono uppercase tracking-wide truncate ${
                    ann.type === 'SOLD' ? 'text-[#00ff66] font-bold' : ann.type === 'TIME_EXTENDED' ? 'text-yellow-500' : 'text-slate-400'
                  }`}>
                    <span className="text-slate-600">&gt;&gt;</span>
                    <span>{ann.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LEADERBOARD / SQUAD MONITOR */}
        <div className="xl:col-span-1 glass-panel p-5 rounded-2xl border border-slate-900 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-black text-white uppercase text-sm tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ff6b00]" /> Telemetry Leaderboard
            </h3>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {sortedTeams.length === 0 ? (
                <div className="text-slate-800 text-center py-12">No rosters loaded.</div>
              ) : (
                sortedTeams.map((t, index) => (
                  <div key={t.refId} className="p-3 bg-black/60 border border-slate-950 hover:border-slate-900 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-600 font-display">#{index + 1}</span>
                      <div>
                        <strong className="text-white text-xs block uppercase truncate max-w-[100px]">{t.teamName}</strong>
                        <span className="text-[8px] text-slate-500 uppercase">{t.refId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[#ffb700] font-bold font-display block text-[11px]">{t.budget} Coins</span>
                      <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Bought: {t.inventory?.length || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 text-center text-slate-600 text-[8px] uppercase tracking-widest font-black">
            Circuit Arena v2.6 // Bidding Module
          </div>
        </div>

      </div>

      {/* FULL SCREEN CELEBRATION WIN OVERLAY */}
      {celebration && (
        <div className="absolute inset-0 bg-[#050508]/95 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in font-mono text-center">
          {/* Glowing laser background particles */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff6b00]/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />

          <div className="max-w-2xl w-full bg-slate-950 border-2 border-[#ff6b00] rounded-3xl p-10 sm:p-14 shadow-[0_0_50px_rgba(255,107,0,0.5)] relative overflow-hidden hud-box">
            
            {/* Glow laser line scans */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent animate-pulse" />

            <div className="space-y-6 relative z-10">
              
              <div className="w-20 h-20 bg-slate-900 border border-[#ff6b00] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                <Gavel className="w-10 h-10 text-[#ff6b00]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-[#ff6b00] uppercase tracking-[0.25em] font-black animate-pulse block">// HAMMER DOWN SOLD //</span>
                <h2 className="text-4xl sm:text-5xl font-display font-black text-white uppercase tracking-wider text-glow-orange mt-2">
                  {celebration.itemName}
                </h2>
              </div>

              <p className="text-slate-400 font-sans text-sm max-w-md mx-auto leading-relaxed">
                Successfully acquired by the engineering squad at the bidding block.
              </p>

              <div className="grid grid-cols-2 gap-4 bg-[#07080c] p-6 rounded-2xl border border-slate-900 text-left max-w-md mx-auto">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">ACQUIRED BY</span>
                  <strong className="text-lg font-display font-black text-[#00f0ff] text-glow-cyan uppercase block mt-1 truncate">
                    {celebration.buyerName}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">TRANSACTION COST</span>
                  <strong className="text-lg font-display font-black text-amber-500 text-glow-orange block mt-1">
                    {celebration.price} Coins
                  </strong>
                </div>
              </div>

              <span className="block text-[9px] text-slate-600 uppercase tracking-widest font-bold">
                Auto-locking hardware inventory profile... Done.
              </span>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default ProjectorView;
