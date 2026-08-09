import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Zap, Shield } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  color: string;
  points: number;
  type: 'chip' | 'resistor' | 'diode';
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
}

export const CircuitBreakoutGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('circuit_breakout_high') || '0');
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<'idle' | 'playing' | 'gameover' | 'victory'>('idle');

  // Game configuration parameters
  const canvasWidth = 640;
  const canvasHeight = 280;
  const paddleWidth = 88;
  const paddleHeight = 10;
  const ballRadius = 6;

  // Mutable game state values managed outside React render loop for 60fps smoothness
  const paddleX = useRef<number>(canvasWidth / 2 - paddleWidth / 2);
  const ballX = useRef<number>(canvasWidth / 2);
  const ballY = useRef<number>(canvasHeight - 35);
  const ballDX = useRef<number>(4);
  const ballDY = useRef<number>(-4);

  const bricks = useRef<Brick[]>([]);
  const sparks = useRef<Spark[]>([]);
  const animationId = useRef<number | null>(null);

  // Sync state reference to avoid loop closures
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Web Audio procedural synthesizer sound effects
  const playOscillatorSound = (type: 'paddle' | 'brick' | 'die' | 'victory') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'paddle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'brick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.04); // A5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'victory') {
        // Arpeggio fanfare
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, now + idx * 0.1);
          gainNode.gain.setValueAtTime(0.05, now + idx * 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscNode.start(now + idx * 0.1);
          oscNode.stop(now + idx * 0.1 + 0.2);
        });
      }
    } catch {
      // Ignore audio load failures
    }
  };

  // Set up board bricks
  const initializeBricks = () => {
    const rows = 3;
    const cols = 8;
    const padding = 10;
    const offsetTop = 20;
    const offsetLeft = 15;
    const width = 68;
    const height = 15;

    const list: Brick[] = [];
    const colors = ['#ff1a40', '#ff4d6d', '#ff758f'];
    const types: Array<'chip' | 'resistor' | 'diode'> = ['chip', 'resistor', 'diode'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          x: c * (width + padding) + offsetLeft,
          y: r * (height + padding) + offsetTop,
          width,
          height,
          active: true,
          color: colors[r % colors.length],
          points: (3 - r) * 10,
          type: types[c % types.length],
        });
      }
    }
    bricks.current = list;
  };

  const spawnSparks = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      sparks.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5 - 1.5,
        color,
        alpha: 1.0,
        decay: Math.random() * 0.03 + 0.02,
      });
    }
  };

  const startGame = () => {
    sound.playClick();
    initializeBricks();
    sparks.current = [];
    setScore(0);

    paddleX.current = canvasWidth / 2 - paddleWidth / 2;
    ballX.current = canvasWidth / 2;
    ballY.current = canvasHeight - 35;
    ballDX.current = (Math.random() > 0.5 ? 4 : -4) + (Math.random() - 0.5);
    ballDY.current = -4.5;

    setGameState('playing');
  };

  // Main rendering loop for HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updatePhysics = () => {
      if (gameStateRef.current !== 'playing') return;

      // Update ball coordinates
      ballX.current += ballDX.current;
      ballY.current += ballDY.current;

      // Boundary Collision: Left/Right walls
      if (ballX.current - ballRadius <= 0) {
        ballX.current = ballRadius;
        ballDX.current *= -1;
      } else if (ballX.current + ballRadius >= canvasWidth) {
        ballX.current = canvasWidth - ballRadius;
        ballDX.current *= -1;
      }

      // Boundary Collision: Top wall
      if (ballY.current - ballRadius <= 0) {
        ballY.current = ballRadius;
        ballDY.current *= -1;
      }

      // Bottom Collision: Paddle or Ground (Game Over)
      if (ballY.current + ballRadius >= canvasHeight - paddleHeight - 15) {
        const px = paddleX.current;
        if (ballX.current >= px && ballX.current <= px + paddleWidth) {
          // Bounce off paddle
          ballY.current = canvasHeight - paddleHeight - 15 - ballRadius;
          ballDY.current *= -1;

          // Alter speed and angle based on hit location
          const relativeHit = (ballX.current - (px + paddleWidth / 2)) / (paddleWidth / 2);
          ballDX.current = relativeHit * 4.5 + (ballDX.current > 0 ? 1 : -1);
          
          // Clamp velocity
          if (Math.abs(ballDX.current) < 1.5) ballDX.current = ballDX.current > 0 ? 2 : -2;
          if (Math.abs(ballDX.current) > 6) ballDX.current = ballDX.current > 0 ? 5.5 : -5.5;

          playOscillatorSound('paddle');
        } else if (ballY.current + ballRadius >= canvasHeight) {
          // Falls past ground - short circuit
          setGameState('gameover');
          playOscillatorSound('die');
        }
      }

      // Brick Collisions
      let activeBricksLeft = false;
      for (const b of bricks.current) {
        if (!b.active) continue;
        activeBricksLeft = true;

        // Simple AABB collision detection
        const testX = Math.max(b.x, Math.min(ballX.current, b.x + b.width));
        const testY = Math.max(b.y, Math.min(ballY.current, b.y + b.height));
        const distX = ballX.current - testX;
        const distY = ballY.current - testY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < ballRadius) {
          b.active = false;
          spawnSparks(testX, testY, b.color);
          playOscillatorSound('brick');

          // Bounce reflection calculations
          const fromLeft = ballX.current < b.x;
          const fromRight = ballX.current > b.x + b.width;
          const fromTop = ballY.current < b.y;
          const fromBottom = ballY.current > b.y + b.height;

          if (fromLeft || fromRight) {
            ballDX.current *= -1;
            ballX.current += ballDX.current;
          }
          if (fromTop || fromBottom) {
            ballDY.current *= -1;
            ballY.current += ballDY.current;
          }

          setScore(prev => {
            const next = prev + b.points;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem('circuit_breakout_high', String(next));
            }
            return next;
          });

          break; // Avoid double brick hits in one frame
        }
      }

      if (!activeBricksLeft) {
        setGameState('victory');
        playOscillatorSound('victory');
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Draw Grid Background
      ctx.strokeStyle = 'rgba(255, 26, 64, 0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvasWidth; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
      for (let y = 0; y < canvasHeight; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }

      // 2. Draw Bricks (glowing electronic components)
      for (const b of bricks.current) {
        if (!b.active) continue;

        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        
        // Draw brick body
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        ctx.fill();

        // Technical details inside components
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        if (b.type === 'chip') {
          // Draw dual pins
          for (let p = 5; p < b.width; p += 12) {
            ctx.fillRect(b.x + p, b.y - 2, 3, 2);
            ctx.fillRect(b.x + p, b.y + b.height, 3, 2);
          }
        } else if (b.type === 'resistor') {
          ctx.fillRect(b.x + b.width / 2 - 4, b.y, 8, b.height);
        } else {
          ctx.beginPath();
          ctx.arc(b.x + b.width / 2, b.y + b.height / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 3. Draw Paddle (Copper trace board)
      ctx.save();
      ctx.fillStyle = '#ff1a40';
      ctx.shadowColor = '#ff1a40';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(paddleX.current, canvasHeight - paddleHeight - 15, paddleWidth, paddleHeight, 5);
      ctx.fill();
      
      // Metallic shine inside paddle
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(paddleX.current + 10, canvasHeight - paddleHeight - 13, paddleWidth - 20, 2);
      ctx.restore();

      // 4. Draw Ball (Glowing electron)
      if (gameStateRef.current === 'playing') {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ff4d6d';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(ballX.current, ballY.current, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw Spark Particles
      sparks.current = sparks.current.filter(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) return false;

        ctx.save();
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // Update calculations
      updatePhysics();

      // Next tick animation frame
      animationId.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, []);

  // Track mouse coordinates over the game box
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
    paddleX.current = Math.max(0, Math.min(relativeX - paddleWidth / 2, canvasWidth - paddleWidth));
  };

  // Handle touch interactions for mobile users
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const relativeX = ((touch.clientX - rect.left) / rect.width) * canvasWidth;
    paddleX.current = Math.max(0, Math.min(relativeX - paddleWidth / 2, canvasWidth - paddleWidth));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-6 relative group p-6 bg-[#090a10]/95 border border-slate-900 rounded-3xl hover:border-[#ff1a40]/30 hover:shadow-[0_0_30px_rgba(255,26,64,0.08)] transition-all duration-300 backdrop-blur-md">
      
      {/* Sci-fi corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff1a40] rounded-tl-md opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff1a40] rounded-tr-md opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff1a40] rounded-bl-md opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff1a40] rounded-br-md opacity-40 group-hover:opacity-100 transition-opacity" />

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* LEFT COLUMN: THE CANVAS ARCADE SCREEN */}
        <div 
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="flex-1 bg-[#040509] border border-slate-950 rounded-2xl relative overflow-hidden flex flex-col justify-center select-none shadow-inner min-h-[200px] cursor-none"
        >
          {/* CRT scanlines overlay */}
          <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-10 z-20" />
          
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-10 p-4">
              <Zap className="w-10 h-10 text-[#ff1a40] animate-bounce mb-3" />
              <h4 className="font-display font-black text-sm sm:text-base text-white tracking-widest uppercase mb-1">
                CIRCUIT BREAKER CORE
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider text-center max-w-sm mb-5">
                Bounce the electron using the paddle to reclaim the electronic component node bricks.
              </p>
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-[#ff1a40] text-white font-display font-black text-xs tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,26,64,0.4)] hover:bg-[#ff4d6d] hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                INSERT COIN
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-4">
              <span className="font-mono text-3xl font-black text-[#ff1a40] tracking-widest uppercase mb-1 animate-pulse">
                SYS SHORT-CIRCUIT
              </span>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider uppercase mb-5">
                Reclaimed Capacity: <span className="text-white font-black">{score} pF</span>
              </p>
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-transparent border border-[#ff1a40] text-[#ff1a40] font-display font-black text-xs tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,26,64,0.2)] hover:bg-[#ff1a40]/10 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                REBOOT CORE
              </button>
            </div>
          )}

          {gameState === 'victory' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-4">
              <Shield className="w-10 h-10 text-[#00ff66] animate-pulse mb-3" />
              <span className="font-mono text-3xl font-black text-[#00ff66] tracking-widest uppercase mb-1">
                SYSTEM STABILIZED
              </span>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider uppercase mb-5">
                Grid fully operational: <span className="text-white font-black">{score} pF</span>
              </p>
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-[#00ff66] text-black font-display font-black text-xs tracking-widest uppercase rounded shadow-[0_0_15px_rgba(0,255,102,0.4)] hover:bg-[#33ff88] hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                REPLAY STAGE
              </button>
            </div>
          )}

          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-auto max-h-[280px]"
          />
        </div>

        {/* RIGHT COLUMN: ARCADE CABINET PANEL (HUD INFO) */}
        <div className="w-full lg:w-[220px] flex flex-row lg:flex-col justify-between gap-5 select-none shrink-0">
          
          {/* LED Scores Display */}
          <div className="flex-1 bg-[#040509] border border-slate-950 rounded-2xl p-5 flex flex-row lg:flex-col justify-around lg:justify-center items-center gap-5 text-center shadow-inner">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#ff758f] uppercase opacity-75 flex items-center gap-1 justify-center">
                <Zap className="w-3 h-3" /> SCORE
              </div>
              <div className="font-mono text-3xl font-black text-white tracking-widest mt-1.5">
                {String(score).padStart(3, '0')}
              </div>
            </div>
            
            <div className="hidden lg:block w-full h-[1px] bg-slate-950 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />

            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1 justify-center">
                <Award className="w-3.5 h-3.5 text-slate-600" /> HIGH
              </div>
              <div className="font-mono text-xl font-bold text-slate-400 tracking-widest mt-1.5">
                {String(highScore).padStart(3, '0')}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CircuitBreakoutGame;
