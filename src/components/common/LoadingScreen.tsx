import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/sound';

interface LoadingScreenProps {
  onComplete: () => void;
  isTransition?: boolean;
}

type CoinState = 'standby' | 'inserting' | 'loading' | 'complete';

interface WarpParticle {
  x: number;
  y: number;
  z: number;
  color: string;
  speed: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, isTransition = false }) => {
  const [coinState, setCoinState] = useState<CoinState>(
    isTransition ? 'loading' : 'standby'
  );
  const [insertProgress, setInsertProgress] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [flashSlot, setFlashSlot] = useState<boolean>(false);

  // Coin spin / hover states
  const [rotY, setRotY] = useState<number>(0);
  const [hoverY, setHoverY] = useState<number>(0);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const coinRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Slow spin & hover animation loop during standby
  useEffect(() => {
    if (coinState !== 'standby') return;
    let animId: number;
    let tick = 0;
    const update = () => {
      tick += 0.04;
      setRotY((prev) => (prev + 1.2) % 360);
      setHoverY(Math.sin(tick) * 8);
      animId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animId);
  }, [coinState]);

  // Insert Coin triggers insertion animation
  const startInsertion = () => {
    if (coinState !== 'standby') return;
    sound.playClick();
    setCoinState('inserting');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.06;
      if (progress >= 1) {
        clearInterval(interval);
        setInsertProgress(1);
        setCoinState('loading');
        sound.playSuccess();
        setFlashSlot(true);
        setTimeout(() => setFlashSlot(false), 500);
      } else {
        setInsertProgress(progress);
      }
    }, 25);
  };

  // Drag and Drop Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (coinState !== 'standby') return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX,
      y: e.clientY
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragOffset.current.x;
    const dy = e.clientY - dragOffset.current.y;
    setDragPos({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    if (coinRef.current && slotRef.current) {
      const coinRect = coinRef.current.getBoundingClientRect();
      const slotRect = slotRef.current.getBoundingClientRect();
      const coinCenter = { x: coinRect.left + coinRect.width / 2, y: coinRect.top + coinRect.height / 2 };
      const slotCenter = { x: slotRect.left + slotRect.width / 2, y: slotRect.top + slotRect.height / 2 };
      
      const dx = slotCenter.x - coinCenter.x;
      const dy = slotCenter.y - coinCenter.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist < 85) {
        // Snap coin into slot position
        setDragPos({ x: dragPos.x + dx, y: dragPos.y + dy });
        sound.playClick();
        setCoinState('inserting');
        
        let progress = 0;
        const interval = setInterval(() => {
          progress += 0.08;
          if (progress >= 1) {
            clearInterval(interval);
            setInsertProgress(1);
            setCoinState('loading');
            sound.playSuccess();
            setFlashSlot(true);
            setTimeout(() => setFlashSlot(false), 500);
            setDragPos({ x: 0, y: 0 }); // reset
          } else {
            setInsertProgress(progress);
          }
        }, 20);
      } else {
        // Return to float center
        setDragPos({ x: 0, y: 0 });
      }
    } else {
      setDragPos({ x: 0, y: 0 });
    }
  };

  // Keyboard shortcut listener (accessibility bypass)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (coinState === 'loading') {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setLoadingProgress(100);
          setCoinState('complete');
          onComplete();
        }
      } else if (coinState === 'standby') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startInsertion();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [coinState, onComplete]);

  // Simulate Diagnostics Loading progression
  useEffect(() => {
    if (coinState !== 'loading') return;

    let progress = 0;
    let timer: any;
    const totalDuration = isTransition ? 1200 : 4000;
    const intervalTime = 30; // Update every 30ms
    const totalSteps = totalDuration / intervalTime;
    const stepIncrement = 100 / totalSteps;

    const updateProgress = () => {
      progress = Math.min(100, progress + stepIncrement);
      setLoadingProgress(progress);

      if (progress >= 100) {
        setTimeout(() => {
          setCoinState('complete');
          onComplete();
        }, isTransition ? 50 : 850); // Snappy finish
      } else {
        timer = setTimeout(updateProgress, intervalTime);
      }
    };

    timer = setTimeout(updateProgress, 100);
    return () => clearTimeout(timer);
  }, [coinState, onComplete, isTransition]);

  // Trigger diagnostic audio feedback at major percentage milestones
  useEffect(() => {
    if (coinState !== 'loading' || isTransition) return;
    const integerProgress = Math.floor(loadingProgress);
    if (integerProgress > 0 && integerProgress % 20 === 0) {
      sound.playDiagnostics();
    }
  }, [loadingProgress, coinState, isTransition]);

  // Canvas Warp Tunnel / Starfield render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Set up particles for warp speed tunnel
    const particles: WarpParticle[] = [];
    const particleCount = 180;
    const colors = ['#ff6b00', '#00f0ff', '#ffb700', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 280 + 30; // Radius off-center
      particles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        z: Math.random() * 1000,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 4
      });
    }

    const fov = 380;
    let gridAngle = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(7, 8, 12, 0.2)'; // Faint trail bleed
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Adjust particle speeds depending on state
      const currentSpeed = coinState === 'loading'
        ? 3 + (loadingProgress / 100) * 38 // Exponential feeling acceleration
        : 1.2; // Gentle standby drift

      // Draw Grid / Concentric wireframes in loading phase
      if (coinState === 'loading') {
        gridAngle += 0.004 + (loadingProgress / 100) * 0.01;
        const ringCount = 6;
        for (let i = 0; i < ringCount; i++) {
          const ringScale = ((i / ringCount) + (loadingProgress * 0.0035)) % 1;
          if (ringScale <= 0) continue;
          
          const r = ringScale * Math.max(width, height) * 0.85;
          ctx.beginPath();
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.07)' : 'rgba(255, 107, 0, 0.07)';
          ctx.lineWidth = 1;
          
          const sides = 8; // Octagonal grid structure
          for (let s = 0; s <= sides; s++) {
            const a = (s / sides) * Math.PI * 2 + gridAngle;
            const rx = centerX + Math.cos(a) * r;
            const ry = centerY + Math.sin(a) * r;
            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.stroke();
        }
      } else {
        // Draw static grid lines that crawl in standby
        ctx.strokeStyle = 'rgba(255, 107, 0, 0.035)';
        ctx.lineWidth = 0.8;
        const gridSize = 45;
        const offset = (Date.now() / 35) % gridSize;
        
        for (let x = offset; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = offset; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Update and draw star streaks
      particles.forEach((p) => {
        const prevZ = p.z;
        p.z -= currentSpeed;

        if (p.z <= 0) {
          p.z = 1000;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 280 + 30;
          p.x = Math.cos(angle) * distance;
          p.y = Math.sin(angle) * distance;
        }

        const px = centerX + (p.x / p.z) * fov;
        const py = centerY + (p.y / p.z) * fov;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          const prevPx = centerX + (p.x / prevZ) * fov;
          const prevPy = centerY + (p.y / prevZ) * fov;

          // Compute size and alpha based on depth mapping
          const size = Math.max(0.5, (1 - p.z / 1000) * 3);
          const alpha = Math.min(1.0, (1000 - p.z) / 700) * (p.z > 80 ? 1.0 : p.z / 80);

          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = size;
          ctx.globalAlpha = alpha;
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [coinState, loadingProgress, isTransition]);

  return (
    <div className="fixed inset-0 z-50 bg-[#07080c] flex flex-col items-center justify-center font-mono select-none overflow-hidden transition-opacity duration-1000">
      
      {/* Embedded Animations styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glitchIn {
          0% { opacity: 0; transform: translateY(5px) skewX(-4deg); filter: blur(2px); }
          50% { opacity: 0.8; transform: translateY(-1px) skewX(4deg); filter: blur(0.5px); }
          100% { opacity: 1; transform: translateY(0) skewX(0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes marquee {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}} />

      {/* Cyber Grid Canvas Backdrop */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Radial Neon Core Backdrop Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#ff6b00]/10 rounded-full blur-[180px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

      {/* VIEWPORT OVERLAY GLASS SCANLINE */}
      <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[length:100%_4px]" />

      {/* STANDBY STAGE: ARCADE FRONT PANEL */}
      {(coinState === 'standby' || coinState === 'inserting') && (
        <div className="relative z-20 flex flex-col items-center justify-center p-8 bg-[#0b0d13]/85 border-2 border-slate-800 rounded-3xl shadow-2xl max-w-sm w-full mx-4 hud-box glass-panel text-center animate-[glitchIn_0.4s_ease-out]">
          
          {/* LED Header Marquee */}
          <div className="w-full bg-[#050608] border border-slate-800/80 py-2.5 px-4 rounded-xl mb-8 font-mono text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#00ff66]/5 animate-pulse" />
            <span className="text-[#00ff66] text-xs font-black tracking-[0.2em] uppercase text-glow-green animate-[marquee_1.5s_infinite]">
              ★ ARENA TERMINAL 01 ★
            </span>
          </div>

          {/* Glowing Coin Slot Visual */}
          <div className="relative w-44 h-60 flex flex-col items-center justify-center border-4 border-[#ff6b00]/30 rounded-2xl bg-[#090b10] shadow-[inset_0_0_25px_rgba(0,0,0,0.95)] p-4 mb-8">
            
            {/* The Floating 3D Token */}
            <div
              ref={coinRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                setIsDragging(false);
                setDragPos({ x: 0, y: 0 });
              }}
              className="absolute cursor-grab active:cursor-grabbing z-30 select-none"
              style={{
                top: '0px',
                touchAction: 'none',
                transform: coinState === 'standby'
                  ? `translate(${dragPos.x}px, ${dragPos.y}px) translateY(${-48 + hoverY}px) rotateY(${rotY}deg) rotateZ(8deg)`
                  : `translate(${dragPos.x * (1 - insertProgress)}px, ${dragPos.y * (1 - insertProgress)}px) translateY(${-48 + insertProgress * 155}px) rotateY(${rotY + insertProgress * 720}deg) rotateX(${insertProgress * 90}deg) scale(${1 - insertProgress * 0.82})`,
                opacity: coinState === 'standby' ? 1 : Math.max(0, 1 - (insertProgress - 0.45) * 1.8),
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease',
              }}
            >
              {/* Token design */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#ffaa00] via-[#ffd700] to-[#ffaa00] border-[5px] border-white shadow-[0_0_30px_rgba(255,200,0,0.9)] flex items-center justify-center select-none active:scale-95 transition-transform duration-100">
                <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#b37400]/40 animate-spin" style={{ animationDuration: '22s' }} />
                <div className="w-[84px] h-[84px] rounded-full bg-[#f29d00] border-2 border-[#b37400] flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                  <span className="text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">🪙</span>
                </div>
              </div>
              
              {/* Tooltip Tag */}
              {coinState === 'standby' && !isDragging && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#ff6b00] text-black font-black text-[8px] px-2.5 py-0.5 rounded tracking-widest uppercase animate-bounce whitespace-nowrap shadow-[0_0_12px_rgba(255,107,0,0.6)]">
                  DRAG & DROP OR CLICK
                </div>
              )}
            </div>

            {/* Neon Outlined Insertion Slot */}
            <div 
              ref={slotRef}
              className={`w-8 h-38 bg-[#040507] border-2.5 rounded-lg transition-all duration-300 flex items-center justify-center relative ${
                flashSlot 
                  ? 'border-green-400 shadow-[0_0_35px_rgba(74,222,128,1)] bg-green-950/50' 
                  : isDragging
                    ? 'border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.7)] animate-pulse bg-green-950/20'
                    : 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              }`}
            >
              {/* Drop Target Hint */}
              {isDragging && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 font-black text-[9px] px-2.5 py-1 rounded tracking-widest uppercase animate-bounce whitespace-nowrap shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                  DROP HERE!
                </div>
              )}

              {/* Internal flashing LED beam */}
              <div className={`w-1.5 h-32 rounded-full transition-all duration-300 ${
                flashSlot ? 'bg-green-400' : isDragging ? 'bg-green-500 animate-pulse' : 'bg-red-600 animate-pulse'
              }`} />
            </div>
            
            {/* Slot indicators */}
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-5">
              SLOT COIN
            </div>
            <div className="text-[11px] text-[#00f0ff] font-bold text-glow-cyan tracking-wider mt-1">
              CREDIT 00/01
            </div>

          </div>

          {/* Action Trigger Button */}
          <div className="space-y-4 w-full">
            <button
              onClick={startInsertion}
              disabled={coinState !== 'standby'}
              className="w-full py-4 bg-gradient-to-r from-[#ff6b00] via-[#ff9900] to-[#ffaa00] text-black font-display font-black text-xs sm:text-sm tracking-[0.15em] uppercase rounded-2xl shadow-[0_0_30px_rgba(255,107,0,0.6)] hover:shadow-[0_0_45px_rgba(255,107,0,0.85)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>[ 🪙 INSERT COIN TO PLAY ]</span>
            </button>

            <span className="block text-[8.5px] text-[#00ff66] font-bold tracking-[0.18em] uppercase animate-pulse">
              PRESS SPACE OR ENTER TO INSERT COIN
            </span>
          </div>

        </div>
      )}

      {/* LOADING STAGE: ROTATING SWEEPING COIN ONLY */}
      {(coinState === 'loading' || coinState === 'complete') && (
        <div className="relative z-20 w-full max-w-4xl px-6 flex flex-col items-center justify-center space-y-8 animate-[glitchIn_0.35s_ease-out]">
          
          {/* Sweeping 3D Coin Display Container (Simplified - No Borders/Backgrounds) */}
          <div className="relative w-full flex items-center justify-center h-64 sm:h-72 overflow-hidden">
            {/* The sweeping coin wrapper using CSS translation & Y rotation keyframes */}
            <div 
              className="animate-logo-right-to-left relative"
              style={{
                animationDuration: isTransition ? '1.2s' : '4s',
                animationIterationCount: isTransition ? '1' : 'infinite',
                animationFillMode: isTransition ? 'forwards' : 'none'
              }}
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#ffaa00] via-[#ffd700] to-[#ffaa00] border-[5px] border-white shadow-[0_0_40px_rgba(255,200,0,0.85)] flex items-center justify-center select-none">
                {/* Glowing energy dash ring around the sweeping coin */}
                <div className="absolute -inset-6 rounded-full border-2 border-dashed border-[#00f0ff] animate-spin opacity-85" style={{ animationDuration: '4s' }} />
                <div className="absolute -inset-4 rounded-full border border-double border-[#ff6b00]/30 animate-pulse" />
                
                {/* Coin ridges */}
                <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#b37400]/40 animate-spin" style={{ animationDuration: '20s' }} />
                
                {/* Coin inner circle */}
                <div className="w-[100px] h-[100px] rounded-full bg-[#f29d00] border-2 border-[#b37400] flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]">
                  <span className="text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">🪙</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default LoadingScreen;
