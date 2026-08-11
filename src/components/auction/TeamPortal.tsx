import React, { useState, useEffect } from 'react';
import { Gavel, ShoppingBag, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';

interface TeamPortalProps {
  socket: any;
  refId: string;
  teams: any[];
  activeItem: any;
}

export const TeamPortal: React.FC<TeamPortalProps> = ({
  socket,
  refId,
  teams,
  activeItem
}) => {
  const [errorText, setErrorText] = useState('');

  const myTeam = teams.find(t => t.refId === refId.trim().toUpperCase()) || {
    refId: refId,
    teamName: `Mock Squad (${refId})`,
    college: 'Telemetry Roster',
    budget: 2000,
    inventory: []
  };

  const currentItem = activeItem?.item;
  const isRunning = activeItem?.isRunning;
  const timer = activeItem?.timer || 0;

  const nextBidAmount = currentItem
    ? currentItem.highestBidder
      ? currentItem.currentBid + currentItem.minIncrement
      : currentItem.basePrice
    : 0;

  const isHighestBidder = currentItem?.highestBidder === refId;
  const hasEnoughBudget = myTeam.budget >= nextBidAmount;
  const isBidDisabled = !activeItem || !isRunning || isHighestBidder || !hasEnoughBudget;

  const handlePlaceBid = () => {
    setErrorText('');
    socket.emit('place_bid', { refId });
  };

  useEffect(() => {
    const handleBidError = (msg: string) => {
      setErrorText(msg);
      setTimeout(() => setErrorText(''), 3000);
    };

    socket.on('bid_error', handleBidError);
    return () => {
      socket.off('bid_error', handleBidError);
    };
  }, [socket]);

  return (
    <div className="text-slate-100 font-mono text-xs text-left space-y-6">
      
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          <h3 className="font-display font-black text-sm uppercase tracking-wide text-white">LIVE SQUAD BIDDING</h3>
        </div>
        
        {activeItem && (
          <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase ${
            isRunning ? 'bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66]' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500'
          }`}>
            {isRunning ? 'Bidding Open' : 'Bidding Paused'}
          </span>
        )}
      </div>

      {errorText && (
        <div className="bg-[#ff1a40]/10 border border-[#ff1a40]/30 text-[#ff1a40] text-xs p-3 rounded text-center font-bold animate-pulse flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: TEAM BUDGET & INVENTORY */}
        <div className="space-y-6 md:col-span-1">
          
          {/* Team Profile & Balance */}
          <div className="bg-[#07080c] p-5 rounded-xl border border-slate-850 space-y-4">
            <div className="border-b border-slate-800/80 pb-2.5">
              <span className="text-[9px] text-[#00f0ff] uppercase block font-bold">// SQUAD BUDGET</span>
              <strong className="text-sm font-display font-bold text-white uppercase block mt-1">{myTeam.teamName}</strong>
              <span className="text-[9px] text-slate-500 block truncate">{myTeam.college}</span>
            </div>

            <div className="p-4 bg-black/40 border border-slate-900 rounded-lg text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff6b00]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff6b00]" />
              
              <span className="text-[9px] text-slate-400 block uppercase">Telemetry Balance</span>
              <span className="text-2xl font-black font-display text-amber-500 text-glow-orange block mt-1.5 font-mono">
                {myTeam.budget} <span className="text-xs font-mono text-white">COINS</span>
              </span>
            </div>

            <div className="text-[10px] text-slate-400 flex justify-between items-center bg-black/40 p-2 rounded">
              <span>REFERENCE ID:</span>
              <strong className="text-[#00f0ff]">{myTeam.refId}</strong>
            </div>
          </div>

          {/* Won Inventory */}
          <div className="bg-[#07080c] p-5 rounded-xl border border-slate-850 space-y-4">
            <h3 className="font-display font-black text-white uppercase text-xs tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#00f0ff]" /> Acquired Hardware ({myTeam.inventory?.length || 0})
            </h3>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {!myTeam.inventory || myTeam.inventory.length === 0 ? (
                <div className="text-slate-700 text-center py-6 font-sans">No items won yet.</div>
              ) : (
                myTeam.inventory.map((item: any, idx: number) => (
                  <div key={idx} className="p-2 bg-black/60 border border-slate-900 rounded flex justify-between items-center">
                    <div>
                      <strong className="text-slate-200 text-xs block truncate max-w-[120px]">{item.name}</strong>
                      <span className="text-[8px] text-slate-500 uppercase">{item.category}</span>
                    </div>
                    <span className="text-[#00ff66] font-bold font-display">{item.purchasePrice} Coins</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIVE AUCTION BIDDING */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Active Item Panel */}
          <div className="bg-[#07080c] p-6 rounded-xl border border-[#ff6b00]/30 space-y-5 bg-[#0e111a]/40 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/5 rounded-full blur-2xl pointer-events-none" />

            {!activeItem ? (
              <div className="text-center py-16 space-y-3 font-sans">
                <Gavel className="w-12 h-12 text-slate-700 mx-auto animate-pulse" />
                <p className="text-slate-400 text-xs">Waiting for the organizer to activate the next component...</p>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Active Details & Timer */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">{currentItem.category}</span>
                    <strong className="text-lg font-display font-black text-white uppercase tracking-wider block">{currentItem.name}</strong>
                    <div className="flex gap-4 pt-1 font-mono text-[9px] text-slate-400">
                      <span>Starting: <strong className="text-white">{currentItem.basePrice} Coins</strong></span>
                      <span>Min Inc: <strong className="text-white">+{currentItem.minIncrement} Coins</strong></span>
                    </div>
                  </div>

                  {/* Countdown display */}
                  <div className="bg-black/60 p-2.5 border border-slate-800 rounded text-center">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">SEC REMAINING</span>
                    <span className={`text-3xl font-display font-black block tracking-tighter ${
                      timer <= 5 ? 'text-red-500 text-glow-red animate-pulse' : 'text-[#00f0ff] text-glow-cyan'
                    }`}>
                      {timer}s
                    </span>
                  </div>
                </div>

                {/* Highest Bidder & Bid Stats */}
                <div className="grid grid-cols-2 gap-4 bg-black/60 p-4 rounded-xl border border-slate-900">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Current High Bid</span>
                    <span className="text-2xl font-black font-display text-amber-500 text-glow-orange block mt-1 font-mono">
                      {currentItem.currentBid} Coins
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Highest Bidder Status</span>
                    {isHighestBidder ? (
                      <span className="text-xs font-bold text-[#00ff66] flex items-center justify-center gap-1.5 mt-2 bg-[#00ff66]/10 px-2 py-1 border border-[#00ff66]/30 rounded">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00ff66]" /> SQUAD HOLDS
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-300 block mt-2 truncate px-2 py-1 bg-slate-900 border border-slate-800 rounded">
                        {currentItem.highestBidderName || '[ NO BIDS YET ]'}
                      </span>
                    )}
                  </div>
                </div>

                {/* GIGANTIC PLACE BID BUTTON */}
                <button
                  type="button"
                  disabled={isBidDisabled}
                  onClick={handlePlaceBid}
                  className={`w-full py-4.5 rounded-xl font-display font-black text-xs tracking-widest uppercase transition-all flex flex-col items-center justify-center gap-1 shadow-lg ${
                    isBidDisabled
                      ? 'bg-slate-900 border border-slate-850 text-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#ff6b00] to-[#ff3c00] hover:scale-[1.01] active:scale-[0.99] text-black shadow-[0_0_20px_rgba(255,107,0,0.35)] cursor-pointer'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Gavel className="w-4.5 h-4.5 shrink-0" />
                    <span>[ PLACE BID ]</span>
                  </span>
                  {currentItem && (
                    <span className="text-[10px] font-mono tracking-normal normal-case font-bold opacity-80 block">
                      Cost: {nextBidAmount} Coins (Increases bid by +{currentItem.minIncrement})
                    </span>
                  )}
                </button>

                {/* Live Info Helpers */}
                {isHighestBidder && (
                  <p className="text-[#00ff66] text-[10px] text-center font-sans">
                    You currently hold the highest bid. Placing another bid is locked.
                  </p>
                )}
                {!hasEnoughBudget && currentItem && (
                  <p className="text-red-500 text-[10px] text-center font-sans font-bold animate-pulse">
                    INSUFFICIENT BUDGET! You cannot afford the next bid of {nextBidAmount} Coins.
                  </p>
                )}

                {/* Bidding Log */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">BIDDING RECORD</span>
                  <div className="bg-black/60 p-3 rounded border border-slate-900 h-[80px] overflow-y-auto space-y-1 font-mono text-[9px]">
                    {activeItem.bidsLog.length === 0 ? (
                      <div className="text-slate-800 text-center py-4">No bids placed.</div>
                    ) : (
                      activeItem.bidsLog.map((log: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-slate-400">
                          <span>[{log.time}] <strong className={log.teamName === myTeam.teamName ? 'text-[#00f0ff]' : 'text-white'}>{log.teamName}</strong>:</span>
                          <strong className="text-amber-500 font-display">{log.amount} Coins</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
export default TeamPortal;
