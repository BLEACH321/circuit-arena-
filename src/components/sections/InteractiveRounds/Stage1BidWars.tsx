import React, { useState } from 'react';
import { ShoppingBag, Gavel, AlertTriangle, RotateCcw } from 'lucide-react';
import { sound } from '../../../utils/sound';

export const Stage1BidWars: React.FC = () => {
  const [budget, setBudget] = useState<number>(2000);

  // Auction Items State
  const [auctionItems, setAuctionItems] = useState([
    { id: 'ic', name: 'Microcontroller IC', category: 'IC', rarity: 'HIGH', currentBid: 650, highBidder: 'TEAM VECTOR', minIncrement: 50 },
    { id: 'sensor', name: 'Ultrasonic Sensor Array', category: 'SENSOR', rarity: 'HIGH', currentBid: 520, highBidder: 'TEAM ALPHA', minIncrement: 40 },
    { id: 'relay', name: 'Opto-Isolated Relay Mod', category: 'RELAY', rarity: 'MEDIUM', currentBid: 380, highBidder: 'TEAM VOLT', minIncrement: 30 },
    { id: 'motor', name: 'High-Torque Stepper Motor', category: 'MOTOR', rarity: 'HIGH', currentBid: 590, highBidder: 'TEAM CIRCUIT', minIncrement: 50 },
    { id: 'trans', name: 'Step-Down Transformer', category: 'TRANSFORMER', rarity: 'PREMIUM', currentBid: 750, highBidder: 'TEAM ALPHA', minIncrement: 60 },
  ]);

  // Electronics Store Items
  const [storeItems, setStoreItems] = useState([
    { id: 'resistor', name: 'Resistor Pack (10k/1k)', price: 20, count: 0 },
    { id: 'capacitor', name: 'Electrolytic Capacitor', price: 30, count: 0 },
    { id: 'led', name: 'RGB Indicator LED', price: 15, count: 0 },
    { id: 'wire', name: 'Jumper Wire Set (20pcs)', price: 10, count: 0 },
  ]);

  const handlePlaceBid = (itemId: string) => {
    const item = auctionItems.find(i => i.id === itemId);
    if (!item) return;

    const newBid = item.currentBid + item.minIncrement;
    const diff = newBid - (item.highBidder === 'YOUR TEAM' ? item.currentBid : 0);

    if (budget < diff) {
      alert('INSUFFICIENT BUDGET! You cannot afford this bid.');
      return;
    }

    sound.playBidSuccess();
    setBudget(prev => prev - diff);
    setAuctionItems(prev =>
      prev.map(i => i.id === itemId ? { ...i, currentBid: newBid, highBidder: 'YOUR TEAM' } : i)
    );
  };

  const handleBuyStoreItem = (id: string, price: number) => {
    if (budget < price) {
      alert('INSUFFICIENT BUDGET for store item!');
      return;
    }
    sound.playClick();
    setBudget(prev => prev - price);
    setStoreItems(prev => prev.map(item => item.id === id ? { ...item, count: item.count + 1 } : item));
  };

  const handleResetAuction = () => {
    sound.playClick();
    setBudget(2000);
    setAuctionItems([
      { id: 'ic', name: 'Microcontroller IC', category: 'IC', rarity: 'HIGH', currentBid: 650, highBidder: 'TEAM VECTOR', minIncrement: 50 },
      { id: 'sensor', name: 'Ultrasonic Sensor Array', category: 'SENSOR', rarity: 'HIGH', currentBid: 520, highBidder: 'TEAM ALPHA', minIncrement: 40 },
      { id: 'relay', name: 'Opto-Isolated Relay Mod', category: 'RELAY', rarity: 'MEDIUM', currentBid: 380, highBidder: 'TEAM VOLT', minIncrement: 30 },
      { id: 'motor', name: 'High-Torque Stepper Motor', category: 'MOTOR', rarity: 'HIGH', currentBid: 590, highBidder: 'TEAM CIRCUIT', minIncrement: 50 },
      { id: 'trans', name: 'Step-Down Transformer', category: 'TRANSFORMER', rarity: 'PREMIUM', currentBid: 750, highBidder: 'TEAM ALPHA', minIncrement: 60 },
    ]);
    setStoreItems([
      { id: 'resistor', name: 'Resistor Pack (10k/1k)', price: 20, count: 0 },
      { id: 'capacitor', name: 'Electrolytic Capacitor', price: 30, count: 0 },
      { id: 'led', name: 'RGB Indicator LED', price: 15, count: 0 },
      { id: 'wire', name: 'Jumper Wire Set (20pcs)', price: 10, count: 0 },
    ]);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#ff6b00] uppercase tracking-widest">[ STAGE 1 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            BID WARS
          </h3>
          <p className="text-xs font-mono text-[#00f0ff] tracking-widest mt-1">
            BID SMART • PROCURE STRATEGICALLY
          </p>
        </div>

        {/* Live Budget Counter Display */}
        <div className="glass-panel px-5 py-2.5 rounded-lg border border-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.3)] flex items-center gap-4">
          <div>
            <span className="block text-[10px] font-mono text-slate-400">REMAINING BUDGET</span>
            <span className="text-2xl font-black font-display text-[#ffb700] text-glow-orange">
              {budget} <span className="text-xs font-mono text-white">PTS</span>
            </span>
          </div>
          <button
            onClick={handleResetAuction}
            title="Reset Simulation"
            className="p-2 bg-[#07080c] border border-slate-700 hover:border-[#ff6b00] text-slate-400 hover:text-white rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">
        Teams compete in a high-stakes live auction for essential components (ICs, Sensors, Relays, Motors, Transformers). Allocate your budget wisely — remaining points influence your final Stage 4 score, while poor component choices restrict circuit capability.
      </p>

      {/* Live Auction Arena */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Gavel className="w-5 h-5 text-[#ff6b00]" />
            LIVE COMPONENT AUCTION
          </h4>
          <span className="text-xs font-mono text-[#00f0ff]">LIVE BIDDING ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctionItems.map((item) => {
            const isHighest = item.highBidder === 'YOUR TEAM';
            return (
              <div
                key={item.id}
                className={`glass-panel p-5 rounded-lg border ${
                  isHighest ? 'border-[#00ff66] bg-[#00ff66]/5 shadow-[0_0_15px_rgba(0,255,102,0.2)]' : 'border-slate-800'
                } relative hud-box flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{item.category}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        item.rarity === 'PREMIUM'
                          ? 'bg-purple-950 text-purple-300 border border-purple-600'
                          : item.rarity === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : 'bg-blue-950 text-blue-300 border border-blue-600'
                      }`}
                    >
                      RARITY: {item.rarity}
                    </span>
                  </div>

                  <h5 className="font-display font-bold text-white text-base mb-4">{item.name}</h5>

                  <div className="bg-[#07080c] p-3 rounded border border-slate-800 space-y-1 font-mono text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">CURRENT BID:</span>
                      <span className="font-bold text-[#ffb700]">{item.currentBid} PTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">HIGH BIDDER:</span>
                      <span className={`font-bold ${isHighest ? 'text-[#00ff66]' : 'text-[#00f0ff]'}`}>
                        {item.highBidder}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlaceBid(item.id)}
                  className={`w-full py-2 px-3 rounded font-display font-bold text-xs tracking-wider uppercase transition-all ${
                    isHighest
                      ? 'bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66]/30'
                      : 'bg-[#ff6b00] hover:bg-[#ff851b] text-black shadow-[0_0_10px_rgba(255,107,0,0.4)]'
                  }`}
                >
                  {isHighest ? '[ YOU HAVE HIGH BID ]' : `[ PLACE BID +${item.minIncrement} PTS ]`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Electronics Store Section */}
      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#00f0ff]" />
            ELECTRONICS STORE (COMMON COMPONENTS)
          </h4>
          <span className="text-xs font-mono text-slate-400">FIXED CATALOG PRICES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {storeItems.map((item) => (
            <div key={item.id} className="glass-panel p-4 rounded border border-slate-800 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs font-display font-bold text-white block mb-1">{item.name}</span>
                <span className="text-lg font-mono font-black text-[#00f0ff] block mb-3">{item.price} PTS</span>
              </div>

              <div className="space-y-2">
                {item.count > 0 && (
                  <span className="block text-[10px] font-mono text-[#00ff66]">PURCHASED: {item.count}</span>
                )}
                <button
                  onClick={() => handleBuyStoreItem(item.id, item.price)}
                  className="w-full py-1.5 bg-[#0e111a] border border-[#00f0ff]/40 hover:border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded text-xs font-mono uppercase transition-colors"
                >
                  BUY ITEM
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Alert */}
      <div className="p-4 bg-[#ff6b00]/10 border border-[#ff6b00]/40 rounded-lg flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-[#ff6b00] shrink-0" />
        <p className="text-xs font-mono text-slate-200">
          <strong className="text-[#ff6b00]">SPEND WISELY:</strong> Your remaining budget determines 15% of your final score in Circuit Showdown. Only purchased and auctioned components may be used on your breadboard build.
        </p>
      </div>

    </div>
  );
};
