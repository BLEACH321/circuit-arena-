import React, { useState } from 'react';
import { ShoppingBag, Gavel, RotateCcw, Gift, GiftIcon } from 'lucide-react';
import { sound } from '../../../utils/sound';

export const Stage1BidWars: React.FC = () => {
  const [budget, setBudget] = useState<number>(2000);
  const [activeSubTab, setActiveSubTab] = useState<'auction' | 'market' | 'mystery' | 'advantage'>('auction');

  // Bidding states for Servo Motor Bidding Animation Example
  const [servoBidStep, setServoBidStep] = useState<number>(0);
  const [servoHighBidder, setServoHighBidder] = useState<string>('JURY SERVER');
  const [servoBidPrice, setServoBidPrice] = useState<number>(200);
  const [servoLog, setServoLog] = useState<string[]>(['Auction initialized. Starting bid: 200 Coins']);

  // Auction Items State for other components
  const [auctionItems, setAuctionItems] = useState([
    { id: 'servo', name: 'Servo Motor', category: 'MOTOR', currentBid: 200, highBidder: 'JURY SERVER', minIncrement: 25 },
    { id: 'ultrasonic', name: 'Ultrasonic Sensor', category: 'SENSOR', currentBid: 150, highBidder: 'JURY SERVER', minIncrement: 25 },
  ]);

  // Engineering Market Items (Exact Price List from Document)
  const [storeItems, setStoreItems] = useState([
    { id: 'breadboard', name: 'Breadboard', price: 100, count: 0 },
    { id: 'led', name: 'LED Pack', price: 30, count: 0 },
    { id: 'resistor', name: 'Resistor Pack', price: 20, count: 0 },
    { id: 'capacitor', name: 'Capacitor Pack', price: 30, count: 0 },
    { id: 'wires', name: 'Jumper Wires', price: 50, count: 0 },
    { id: 'button', name: 'Push Button', price: 20, count: 0 },
    { id: 'buzzer', name: 'Buzzer', price: 50, count: 0 },
  ]);

  // Mystery Drop states
  const [mysteryRevealed, setMysteryRevealed] = useState<boolean>(false);
  const [mysteryContent, setMysteryContent] = useState<string>('');
  const mysteryOptions = ['IR Sensor', 'Relay Module', 'Motor Driver', 'Temperature Sensor', 'Approved LDR Module'];

  // Final Advantage chits
  const [chitOpened, setChitOpened] = useState<boolean>(false);
  const [revealedChit, setRevealedChit] = useState<string>('');
  const advantages = [
    { title: '+200 Circuit Coins', desc: 'The squad\'s budget increases by 200 Circuit Coins immediately.' },
    { title: 'FREE BASIC COMPONENT', desc: 'The squad can claim one eligible basic component from the market.' },
    { title: '50% MARKET DISCOUNT', desc: 'The squad receives a 50% discount on one eligible market purchase.' },
    { title: 'FREE MYSTERY DROP', desc: 'The squad receives one Advanced Mystery Box without paying for it.' },
    { title: 'COMPONENT EXCHANGE', desc: 'The squad is authorized to exchange one purchased component.' },
    { title: '+5 INNOVATION MARKS', desc: 'The squad receives +5 marks only if the associated feature is successfully implemented.' },
    { title: 'BETTER LUCK NEXT TIME', desc: 'No advantage granted. Continue with basic telemetry.' }
  ];

  // Increment Servo Bidding example step
  const handleServoBidStep = () => {
    sound.playClick();
    if (servoBidStep === 0) {
      // Team A bids 225
      setServoBidPrice(225);
      setServoHighBidder('TEAM A');
      setServoLog(prev => [...prev, '➔ Team A bids 225 Coins']);
      setServoBidStep(1);
    } else if (servoBidStep === 1) {
      // Team B bids 250
      setServoBidPrice(250);
      setServoHighBidder('TEAM B');
      setServoLog(prev => [...prev, '➔ Team B bids 250 Coins']);
      setServoBidStep(2);
    } else if (servoBidStep === 2) {
      // Team C bids 275
      setServoBidPrice(275);
      setServoHighBidder('TEAM C');
      setServoLog(prev => [...prev, '➔ Team C bids 275 Coins (Team C wins!)']);
      setServoBidStep(3);
    }
  };

  const handlePlaceBid = (itemId: string) => {
    const item = auctionItems.find(i => i.id === itemId);
    if (!item) return;

    const newBid = item.currentBid + item.minIncrement;
    if (budget < item.minIncrement) {
      alert('INSUFFICIENT BUDGET! You cannot afford this bid.');
      return;
    }

    sound.playBidSuccess();
    setBudget(prev => prev - item.minIncrement);
    setAuctionItems(prev =>
      prev.map(i => i.id === itemId ? { ...i, currentBid: newBid, highBidder: 'YOUR SQUAD' } : i)
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

  const handleBuyMysteryDrop = () => {
    if (budget < 300) {
      alert('INSUFFICIENT BUDGET! Advanced Mystery Box requires 300 Coins.');
      return;
    }
    sound.playBidSuccess();
    setBudget(prev => prev - 300);
    const randomItem = mysteryOptions[Math.floor(Math.random() * mysteryOptions.length)];
    setMysteryContent(randomItem);
    setMysteryRevealed(true);
  };

  const handleOpenChit = () => {
    sound.playSuccess();
    const randomChit = advantages[Math.floor(Math.random() * advantages.length)];
    setRevealedChit(randomChit.title + " — " + randomChit.desc);
    setChitOpened(true);
  };

  const handleResetAuction = () => {
    sound.playClick();
    setBudget(2000);
    setServoBidStep(0);
    setServoBidPrice(200);
    setServoHighBidder('JURY SERVER');
    setServoLog(['Auction initialized. Starting bid: 200 Coins']);
    setAuctionItems([
      { id: 'servo', name: 'Servo Motor', category: 'MOTOR', currentBid: 200, highBidder: 'JURY SERVER', minIncrement: 25 },
      { id: 'ultrasonic', name: 'Ultrasonic Sensor', category: 'SENSOR', currentBid: 150, highBidder: 'JURY SERVER', minIncrement: 25 },
    ]);
    setStoreItems([
      { id: 'breadboard', name: 'Breadboard', price: 100, count: 0 },
      { id: 'led', name: 'LED Pack', price: 30, count: 0 },
      { id: 'resistor', name: 'Resistor Pack', price: 20, count: 0 },
      { id: 'capacitor', name: 'Capacitor Pack', price: 30, count: 0 },
      { id: 'wires', name: 'Jumper Wires', price: 50, count: 0 },
      { id: 'button', name: 'Push Button', price: 20, count: 0 },
      { id: 'buzzer', name: 'Buzzer', price: 50, count: 0 },
    ]);
    setMysteryRevealed(false);
    setMysteryContent('');
    setChitOpened(false);
    setRevealedChit('');
  };

  return (
    <div className="space-y-8 text-left font-mono">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-[#ff6b00] uppercase tracking-widest">[ STAGE 1 ]</span>
          <h3 className="text-3xl font-black font-display text-white tracking-wide uppercase mt-1">
            THE COMPONENT BATTLE
          </h3>
          <p className="text-xs font-mono text-[#00f0ff] tracking-widest mt-1">
            INITIAL BUDGET: 2000 CIRCUIT COINS
          </p>
        </div>

        {/* Live Budget Counter Display */}
        <div className="glass-panel px-5 py-2.5 rounded-lg border border-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.3)] flex items-center gap-4">
          <div>
            <span className="block text-[10px] font-mono text-slate-400">REMAINING COINS</span>
            <span className="text-2xl font-black font-display text-[#ffb700] text-glow-orange">
              {budget} <span className="text-xs font-mono text-white">COINS</span>
            </span>
          </div>
          <button
            onClick={handleResetAuction}
            title="Reset Simulation"
            className="p-2 bg-[#07080c] border border-slate-700 hover:border-[#ff6b00] text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed font-sans">
        The Component Battle is the crucial staging round where squads must secure their hardware arsenal. Balance your bids, select standard parts carefully at the Engineering Market, and choose whether to risk capital on the Mystery Drop.
      </p>

      {/* Sub tabs navigation */}
      <div className="flex flex-wrap gap-2 text-xs border-b border-slate-900 pb-3">
        {[
          { id: 'auction', label: 'ROUND 1A: COMPONENT BATTLE', color: '#ff6b00' },
          { id: 'market', label: 'ROUND 1B: ENGINEERING MARKET', color: '#00f0ff' },
          { id: 'mystery', label: 'ROUND 1C: MYSTERY DROP', color: '#ff1a40' },
          { id: 'advantage', label: 'ROUND 1D: FINAL ADVANTAGE', color: '#a855f7' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { sound.playClick(); setActiveSubTab(tab.id as any); }}
            className={`px-3 py-1.5 rounded font-bold uppercase transition-all ${
              activeSubTab === tab.id
                ? 'bg-slate-900 text-white border'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            style={{ borderColor: activeSubTab === tab.id ? tab.color : 'transparent' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ROUND 1A: AUCTION SIMULATION */}
      {activeSubTab === 'auction' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Box: Animated Official Bidding Example */}
            <div className="glass-panel p-6 rounded-xl border border-[#ff6b00]/40 space-y-4">
              <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#ff6b00]">
                <Gavel className="w-4 h-4" /> OFFICIAL BIDDING PROTOCOL EXAMPLE
              </h4>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Bidding increments are fixed at <strong className="text-white">+25 Coins</strong> each time. Follow the exact bidding sequence from the official rulebook:
              </p>

              <div className="bg-[#07080c] p-4 rounded border border-slate-900 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold">COMPONENT: Servo Motor</span>
                  <span className="text-[#ffb700] font-bold">STARTING BID: 200 COINS</span>
                </div>

                <div className="space-y-1 text-[10px] text-slate-400 font-mono bg-black/60 p-3 rounded max-h-[120px] overflow-y-auto">
                  {servoLog.map((log, index) => (
                    <div key={index} className={log.includes('Team C wins') ? 'text-[#00ff66] font-bold' : ''}>
                      {log}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-900">
                  <span className="text-slate-500">CURRENT HIGHEST:</span>
                  <span className="text-white font-bold">{servoHighBidder} ({servoBidPrice} Coins)</span>
                </div>
              </div>

              {servoBidStep < 3 ? (
                <button
                  onClick={handleServoBidStep}
                  className="w-full py-2 bg-[#ff6b00] hover:bg-[#ff851b] text-black font-display font-bold text-xs uppercase rounded"
                >
                  {servoBidStep === 0 && '[ SIMULATE TEAM A BID: 225 COINS ]'}
                  {servoBidStep === 1 && '[ SIMULATE TEAM B BID: 250 COINS ]'}
                  {servoBidStep === 2 && '[ SIMULATE TEAM C BID: 275 COINS ]'}
                </button>
              ) : (
                <div className="p-3 bg-[#00ff66]/10 border border-[#00ff66]/40 rounded text-[#00ff66] text-center text-xs font-bold">
                  ➔ TEAM C SECURES SERVO MOTOR AT 275 COINS
                </div>
              )}
            </div>

            {/* Right Box: Squad Custom Auctions */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
              <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#00f0ff]">
                <Gavel className="w-4 h-4" /> ACTIVE SQUAD COMPONENT BATTLES
              </h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Place active bids for essential sensors and motors. Every bid increases the price by 25 Coins.
              </p>

              <div className="space-y-3">
                {auctionItems.map((item) => (
                  <div key={item.id} className="p-3 bg-[#07080c] border border-slate-900 rounded flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 block">{item.category}</span>
                      <strong className="text-white text-xs">{item.name}</strong>
                      <span className="block text-[9px] text-[#ffb700] mt-0.5">
                        Current: {item.currentBid} Coins (Bidder: {item.highBidder})
                      </span>
                    </div>

                    <button
                      onClick={() => handlePlaceBid(item.id)}
                      className="px-3 py-2 bg-[#0e111a] border border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 text-[#00f0ff] rounded text-[10px] uppercase font-bold"
                    >
                      +25 BID
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ROUND 1B: ENGINEERING MARKET */}
      {activeSubTab === 'market' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2 text-[#00f0ff]">
              <ShoppingBag className="w-4 h-4 text-[#00f0ff]" /> ENGINEERING MARKET LIST
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">FIXED PRICING ENFORCED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {storeItems.map((item) => (
              <div key={item.id} className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[140px] bg-[#07080c]/50">
                <div>
                  <h5 className="font-display font-bold text-white text-xs uppercase">{item.name}</h5>
                  <span className="text-lg font-black text-[#ffb700] block mt-2">
                    {item.price} <span className="text-[10px] text-slate-400 font-mono">COINS</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-900 mt-4">
                  <span className="text-[9px] text-[#00ff66] font-bold">QTY BOUGHT: {item.count}</span>
                  <button
                    onClick={() => handleBuyStoreItem(item.id, item.price)}
                    className="px-2.5 py-1 bg-[#00f0ff] hover:bg-[#5ce1e6] text-black font-display font-black text-[9px] uppercase rounded"
                  >
                    BUY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROUND 1C: MYSTERY DROP */}
      {activeSubTab === 'mystery' && (
        <div className="max-w-md mx-auto space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-2 border-[#ff1a40] text-center space-y-5 bg-[#0e111a]/85 shadow-[0_0_25px_rgba(255,26,64,0.15)] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#ff1a40]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-16 h-16 bg-[#07080c] border border-slate-800 rounded-xl flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <GiftIcon className="w-8 h-8 text-[#ff1a40]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#ff1a40] uppercase font-bold tracking-widest block">// UNCERTAINTY INVENTORY</span>
              <h4 className="font-display font-black text-xl text-white uppercase">ADVANCED MYSTERY BOX</h4>
              <span className="text-[#ffb700] font-black text-lg block">300 COINS</span>
            </div>

            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              Risk remaining coins for a potential high-value addition. Possible contents: **IR Sensor, Relay Module, Motor Driver, Temperature Sensor, or other approved telemetry components.**
            </p>

            {mysteryRevealed ? (
              <div className="p-4 bg-[#00ff66]/10 border border-[#00ff66]/40 rounded text-[#00ff66] font-bold text-xs uppercase">
                DECRYPTED CONTENT: {mysteryContent}
              </div>
            ) : (
              <button
                onClick={handleBuyMysteryDrop}
                className="w-full py-3 bg-[#ff1a40] hover:bg-[#ff4d6d] text-white font-display font-black text-xs uppercase rounded cursor-pointer"
              >
                [ BUY MYSTERY DROP ]
              </button>
            )}
          </div>
        </div>
      )}

      {/* ROUND 1D: FINAL ADVANTAGE */}
      {activeSubTab === 'advantage' && (
        <div className="max-w-md mx-auto space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-2 border-[#a855f7] text-center space-y-5 bg-[#0e111a]/85 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#a855f7]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 bg-[#07080c] border border-slate-800 rounded-xl flex items-center justify-center mx-auto shadow-inner">
              <Gift className="w-8 h-8 text-[#a855f7]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#a855f7] uppercase font-bold tracking-widest block">// CHIT PROTOCOL</span>
              <h4 className="font-display font-black text-xl text-white uppercase">FINAL ADVANTAGE</h4>
            </div>

            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              Draw one random Fortune Chit immediately. Every chit contains exactly one of the official advantages listed in the document.
            </p>

            {chitOpened ? (
              <div className="p-4 bg-[#a855f7]/10 border border-[#a855f7]/40 rounded text-[#a855f7] text-left text-xs space-y-1">
                <span className="font-black uppercase tracking-wider block">// UNLOCKED ADVANTAGE:</span>
                <p className="text-white leading-normal font-sans">{revealedChit}</p>
              </div>
            ) : (
              <button
                onClick={handleOpenChit}
                className="w-full py-3 bg-[#a855f7] hover:bg-[#b86dfc] text-black font-display font-black text-xs uppercase rounded cursor-pointer"
              >
                [ DRAW FORTUNE CHIT ]
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
export default Stage1BidWars;
