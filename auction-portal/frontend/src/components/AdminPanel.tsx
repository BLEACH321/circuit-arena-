import React, { useState, useRef } from 'react';
import { Upload, Play, Pause, RotateCcw, Gavel, LogOut, Users, ShoppingBag } from 'lucide-react';

interface AdminPanelProps {
  socket: any;
  teams: any[];
  catalogue: any[];
  activeItem: any;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  socket,
  teams,
  catalogue,
  activeItem,
  onLogout
}) => {
  const [csvText, setCsvText] = useState('');
  const [csvError, setCsvError] = useState('');
  const [startingBudget, setStartingBudget] = useState(2000);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple CSV parser
  const parseCSVData = (text: string) => {
    const lines = text.split('\n');
    const parsedTeams: any[] = [];
    
    // Skip header line if it contains metadata like refId or teamName
    let startIndex = 0;
    if (lines[0] && (lines[0].toLowerCase().includes('id') || lines[0].toLowerCase().includes('name'))) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse commas, keeping in mind possible quotes
      const parts = line.split(',').map(s => s.replace(/^["']|["']$/g, '').trim());
      if (parts.length >= 3) {
        const refId = parts[0];
        const teamName = parts[1];
        const college = parts[2];
        const budget = Number(parts[3]) || startingBudget;
        
        if (refId && teamName) {
          parsedTeams.push({ refId, teamName, college, budget });
        }
      }
    }
    return parsedTeams;
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const parsed = parseCSVData(text);
        if (parsed.length === 0) {
          setCsvError('No valid rows found. Format: ReferenceID,TeamName,College,Budget(optional)');
          return;
        }
        socket.emit('admin_set_teams', parsed);
        setCsvError('');
        alert(`Successfully imported ${parsed.length} teams!`);
      } catch (err) {
        setCsvError('Error parsing CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handlePasteCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = parseCSVData(csvText);
      if (parsed.length === 0) {
        setCsvError('No valid rows found. Format: ReferenceID,TeamName,College,Budget(optional)');
        return;
      }
      socket.emit('admin_set_teams', parsed);
      setCsvText('');
      setCsvError('');
      alert(`Successfully imported ${parsed.length} teams!`);
    } catch (err) {
      setCsvError('Error parsing pasted CSV.');
    }
  };

  const handleActivate = (id: string) => {
    socket.emit('admin_activate_item', id);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 font-mono text-xs text-left p-6">
      
      {/* Top Banner Nav */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] text-[#ff1a40] uppercase tracking-widest font-black">// ORGANIZER CORE CONSOLE</span>
          <h1 className="font-display font-black text-2xl tracking-wide uppercase text-white mt-1">
            AUCTION <span className="text-[#ff1a40] text-glow-red">CONTROL TOWER</span>
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all team rosters, budgets, and bid histories?')) {
                socket.emit('admin_clear_all');
              }
            }}
            className="px-4 py-2 bg-red-950/30 border border-red-800 hover:bg-red-900/50 text-red-400 rounded uppercase font-bold"
          >
            Clear All Roster
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-[#0e111a] border border-slate-700 hover:border-[#ff1a40] text-slate-400 hover:text-white rounded uppercase font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit Console
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: TEAM IMPORT & SETUP */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* CSV Import */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-display font-black text-[#ff6b00] uppercase text-sm tracking-wide">
              1. Import Team Roster
            </h3>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
              Upload a CSV file or paste spreadsheet rows. Format: <br />
              <code className="text-white font-mono block bg-black/60 p-2 mt-1 rounded">
                ReferenceID, TeamName, College, Budget(Optional)
              </code>
            </p>

            <div className="space-y-2">
              <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Import via CSV File</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-[#0e111a] hover:bg-[#ff6b00]/10 border border-slate-800 hover:border-[#ff6b00]/50 rounded flex items-center justify-center gap-2 text-white font-bold"
              >
                <Upload className="w-4 h-4 text-[#ff6b00]" /> Select CSV File
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800/80"></div>
              <span className="flex-shrink mx-3 text-slate-600 text-[9px] uppercase font-bold">OR PASTE CSV ROWS</span>
              <div className="flex-grow border-t border-slate-800/80"></div>
            </div>

            <form onSubmit={handlePasteCsvSubmit} className="space-y-3">
              <textarea
                placeholder="e.g.&#10;CA-001, Cyber Hackers, MIT, 2000&#10;CA-002, Circuit Wizards, IIT, 2000"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={4}
                className="w-full p-2.5 bg-[#07080c] border border-slate-800 focus:border-[#ff6b00] rounded text-white font-mono placeholder-slate-700 outline-none text-[10px]"
              />
              {csvError && <p className="text-red-500 text-[9px]">{csvError}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-[#ff6b00]/10 hover:bg-[#ff6b00] border border-[#ff6b00]/50 hover:text-black text-[#ff6b00] font-bold rounded transition-colors"
              >
                Submit CSV Text
              </button>
            </form>
          </div>

          {/* Reset Engine / Budget Set */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4 text-left">
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide">
              2. Simulation Parameters
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Starting Budget:</span>
                <input
                  type="number"
                  value={startingBudget}
                  onChange={(e) => setStartingBudget(Number(e.target.value))}
                  className="w-20 p-1.5 bg-[#07080c] border border-slate-800 focus:border-[#ff6b00] rounded text-white text-right outline-none font-bold"
                />
              </div>

              <button
                onClick={() => {
                  if (confirm(`Reset all squad budgets to ${startingBudget} Coins and clear active auctions?`)) {
                    socket.emit('admin_reset_budgets', startingBudget);
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-red-950 to-orange-950 hover:from-red-900 hover:to-orange-900 border border-red-800 hover:border-orange-500 rounded text-slate-200 hover:text-white uppercase font-black tracking-widest shadow-md transition-colors"
              >
                Reset Bids & Set Budgets
              </button>
            </div>
          </div>

          {/* Connected Teams Monitor */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00f0ff]" /> Telemetry Feed ({teams.length} Roster)
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {teams.length === 0 ? (
                <div className="text-slate-600 text-center py-6">No teams loaded. Upload a CSV.</div>
              ) : (
                teams.map((t) => (
                  <div key={t.refId} className="p-2.5 bg-[#07080c] border border-slate-900 hover:border-slate-800 rounded flex justify-between items-center">
                    <div>
                      <strong className="text-white text-xs block">{t.teamName}</strong>
                      <span className="text-[9px] text-slate-500 uppercase">{t.refId} • {t.college}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-500 font-bold font-display block">{t.budget} Coins</span>
                      <span className="text-[9px] text-[#00ff66] block">Bought: {t.inventory?.length || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN: ACTIVE BIDDING STAGE & ENGINE */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Active Item Engine */}
          <div className="glass-panel p-6 rounded-xl border border-[#ff1a40]/30 space-y-5 bg-[#0e111a]/40 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff1a40]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] text-[#ff1a40] uppercase font-bold tracking-widest block">// BIDDING ENGINE MONITOR</span>
                <h3 className="text-lg font-black font-display text-white uppercase mt-0.5">ACTIVE AUCTION ITEM</h3>
              </div>
              
              {activeItem && (
                <span className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase ${
                  activeItem.isRunning ? 'bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66]' : 'bg-yellow-500/10 border border-yellow-500/40 text-yellow-500'
                }`}>
                  {activeItem.isRunning ? 'Ticking' : 'Paused'}
                </span>
              )}
            </div>

            {!activeItem ? (
              <div className="text-center py-12 space-y-3">
                <Gavel className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-slate-400 font-sans">No item currently active. Select a component from the catalogue below to begin bidding.</p>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Active Info Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">{activeItem.item.category}</span>
                    <strong className="text-xl font-display font-black text-white uppercase tracking-wider block">{activeItem.item.name}</strong>
                    <div className="flex gap-4 pt-1 font-mono text-[10px]">
                      <span>Starting: <strong className="text-slate-300">{activeItem.item.basePrice} Coins</strong></span>
                      <span>Min Inc: <strong className="text-slate-300">+{activeItem.item.minIncrement} Coins</strong></span>
                    </div>
                  </div>

                  {/* Gigantic Timer Clock */}
                  <div className="bg-[#07080c] p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">SEC REMAINING</span>
                    <span className={`text-4xl font-display font-black block tracking-tighter ${
                      activeItem.timer <= 5 ? 'text-red-500 text-glow-red animate-pulse' : 'text-[#00f0ff] text-glow-cyan'
                    }`}>
                      {activeItem.timer}s
                    </span>
                  </div>
                </div>

                {/* Bidding Stats */}
                <div className="grid grid-cols-2 gap-4 bg-[#07080c]/80 p-4 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Current High Bid</span>
                    <span className="text-2xl font-black font-display text-amber-500 text-glow-orange block mt-1">
                      {activeItem.item.currentBid} Coins
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Highest Bidder</span>
                    <span className="text-sm font-bold text-white block mt-2 truncate">
                      {activeItem.item.highestBidderName || '[ NO ACTIVE BIDS ]'}
                    </span>
                  </div>
                </div>

                {/* Timer & Admin Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {!activeItem.isRunning ? (
                    <button
                      onClick={() => socket.emit('admin_start_timer')}
                      className="py-3 bg-[#00ff66]/10 hover:bg-[#00ff66] border border-[#00ff66]/50 hover:text-black text-[#00ff66] rounded uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Timer
                    </button>
                  ) : (
                    <button
                      onClick={() => socket.emit('admin_pause_timer')}
                      className="py-3 bg-yellow-500/10 hover:bg-yellow-500 border border-yellow-500/50 hover:text-black text-yellow-500 rounded uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause Timer
                    </button>
                  )}

                  <button
                    onClick={() => socket.emit('admin_reset_timer', 30)}
                    className="py-3 bg-[#0e111a] border border-slate-700 hover:border-slate-500 text-slate-300 rounded uppercase font-bold flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset (30s)
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('HAMMER DOWN! Sell this item to current highest bidder?')) {
                        socket.emit('admin_sell_item');
                      }
                    }}
                    className="py-3 bg-[#ff1a40] hover:bg-[#ff4d6d] text-white rounded uppercase font-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,26,64,0.3)] cursor-pointer"
                  >
                    <Gavel className="w-3.5 h-3.5" /> Sell Item
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Mark this item as Unsold / Skip?')) {
                        socket.emit('admin_unsold_item');
                      }
                    }}
                    className="py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 rounded uppercase font-bold"
                  >
                    Mark Unsold
                  </button>
                </div>

                {/* Bidding Log Feed */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">BID LOG (LATEST FIRST)</span>
                  <div className="bg-black/80 p-3.5 rounded border border-slate-900 h-[100px] overflow-y-auto space-y-1 font-mono text-[10px]">
                    {activeItem.bidsLog.length === 0 ? (
                      <div className="text-slate-700 text-center py-6">No bids recorded yet.</div>
                    ) : (
                      activeItem.bidsLog.map((log: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-slate-300">
                          <span>[{log.time}] <strong className="text-white">{log.teamName}</strong> bid:</span>
                          <strong className="text-amber-500 font-display">{log.amount} Coins</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Component Catalogue */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-display font-black text-white uppercase text-sm tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#ff6b00]" /> Hardware Catalogue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {catalogue.map((item) => (
                <div key={item.id} className="p-3 bg-[#07080c] border border-slate-900 hover:border-slate-800 rounded flex justify-between items-center">
                  <div>
                    <span className="text-[8px] text-slate-600 uppercase block">{item.category}</span>
                    <strong className="text-slate-200 text-xs block mt-0.5">{item.name}</strong>
                    <span className="text-[9px] text-[#ffb700] block mt-1">Base Price: {item.basePrice} Coins</span>
                    {item.status === 'SOLD' && (
                      <span className="text-[9px] text-[#00ff66] block font-bold mt-0.5">Sold: {item.currentBid} Coins ({item.highestBidderName})</span>
                    )}
                    {item.status === 'UNSOLD' && (
                      <span className="text-[9px] text-slate-500 block mt-0.5">Available</span>
                    )}
                  </div>

                  <button
                    disabled={item.status === 'SOLD'}
                    onClick={() => handleActivate(item.id)}
                    className={`px-3 py-2 text-[10px] font-bold rounded uppercase ${
                      item.status === 'SOLD'
                        ? 'bg-slate-900 border border-slate-800/80 text-slate-700 cursor-not-allowed'
                        : 'bg-[#ff6b00]/10 hover:bg-[#ff6b00] border border-[#ff6b00]/40 hover:text-black text-[#ff6b00] transition-colors'
                    }`}
                  >
                    Activate
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default AdminPanel;
