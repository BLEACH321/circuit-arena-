import React, { useState, useEffect } from 'react';
import { Lock, Play, Instagram, Linkedin, Github } from 'lucide-react';
import { sound } from '../../utils/sound';
import heroRobotBg from '../../assets/hero_robot_bg.png';
import { useArena } from '../../context/ArenaContext';
import { CircuitBreakoutGame } from './CircuitBreakoutGame';

export const Hero: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse Parallax Effect for the Background image
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientWidth, clientHeight } = document.documentElement;
      // Map mouse position to -12px to +12px boundary offsets
      const x = (e.clientX / clientWidth - 0.5) * 24;
      const y = (e.clientY / clientHeight - 0.5) * 24;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { arenaOpen } = useArena();

  const handleEnterArenaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playClick();
    if (arenaOpen) {
      const target = document.getElementById('rounds');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  const handleExplore = () => {
    sound.playClick();
    const target = document.getElementById('about');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 overflow-hidden scanline-overlay bg-[#050508]">
      
      {/* Dynamic Keyframe Animations for breathing glow effects */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bgBreathing {
          0% {
            filter: drop-shadow(0 0 10px rgba(255, 26, 64, 0.15)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(255, 26, 64, 0.4)) brightness(1.12);
          }
          100% {
            filter: drop-shadow(0 0 10px rgba(255, 26, 64, 0.15)) brightness(1);
          }
        }
        .animate-bg-breathing {
          animation: bgBreathing 6s ease-in-out infinite;
        }
      `}} />

      {/* Background Graphic Blueprint */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-20" />

      {/* Dynamic Background Image with Mouse Parallax and Breathing animation */}
      <div 
        className="absolute inset-y-0 right-0 w-full bg-cover bg-right bg-no-repeat pointer-events-none opacity-45 md:opacity-85 z-0 transition-transform duration-500 ease-out animate-bg-breathing"
        style={{
          backgroundImage: `url(${heroRobotBg})`,
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 80%)',
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) scale(1.04)`
        }}
      />
      
      {/* Glow Nodes */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#ff1a40]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-[#ff0055]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between flex-1">
        
        {/* Upper Hero Flex Grid (Split Text & Character space) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 py-4">
          
          {/* Left Text Content */}
          <div className="flex flex-col items-start text-left max-w-xl md:max-w-2xl">
            
            {/* Tagline */}
            <div className="flex items-center gap-2.5 text-[#ff1a40] text-xs font-mono tracking-[0.25em] uppercase mb-6 font-black select-none">
              <span className="w-5 h-[2px] bg-[#ff1a40] rounded-full animate-pulse" />
              THE FINALS
            </div>

            {/* Main Heading (Dual Line, Solid and Outline) */}
            <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-none select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              <span className="block text-white">CIRCUIT</span>
              <span 
                className="block text-transparent"
                style={{
                  WebkitTextStroke: '2px #ff1a40',
                  textShadow: '0 0 15px rgba(255, 26, 64, 0.4), 0 0 30px rgba(255, 26, 64, 0.2)'
                }}
              >
                ARENA
              </span>
              <span className="block text-glow-orange text-[#ff1a40] text-3xl sm:text-4xl tracking-[0.1em] font-black mt-2 font-mono">
                // THE FINALS
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-8 max-w-lg text-slate-200 text-glow-cyan font-display font-black text-lg sm:text-xl tracking-wider leading-relaxed border-l-4 border-[#ff1a40] pl-4 uppercase">
              "Bid. Build. Battle. Become the Champion."
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-row items-center gap-5 mt-10 relative">
              
              {/* ENTER THE ARENA BUTTON */}
              <div className="relative group">
                <button
                  onClick={handleEnterArenaClick}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="px-8 py-3.5 bg-[#ff1a40] text-white font-display font-black text-xs sm:text-sm tracking-widest uppercase rounded shadow-[0_0_20px_rgba(255,26,64,0.55)] hover:shadow-[0_0_30px_rgba(255,26,64,0.85)] hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer border border-white/10"
                >
                  ENTER ARENA
                </button>

                {/* COMING SOON TOOLTIP */}
                {showTooltip && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-200 pointer-events-none z-30">
                    <div className="px-3 py-1.5 bg-[#ff0055] text-white font-mono font-bold text-xs uppercase rounded shadow-[0_0_15px_rgba(255,0,85,0.8)] whitespace-nowrap flex items-center gap-1.5 border border-white/20">
                      <Lock className="w-3.5 h-3.5 text-white" />
                      <span>COMING SOON</span>
                    </div>
                    <div className="w-2 h-2 bg-[#ff0055] transform rotate-45 mx-auto -mt-1" />
                  </div>
                )}
              </div>

              {/* WATCH TRAILER BUTTON */}
              <button
                onClick={handleExplore}
                className="px-8 py-3.5 bg-transparent border border-slate-700 hover:border-[#ff1a40] text-white font-display font-bold text-xs sm:text-sm tracking-widest uppercase rounded hover:bg-[#ff1a40]/10 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
              >
                <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center group-hover:border-[#ff1a40]">
                  <Play className="w-2.5 h-2.5 text-[#ff1a40] fill-[#ff1a40] translate-x-0.5" />
                </div>
                WATCH TRAILER
              </button>
            </div>

            {/* Social Follow Links */}
            <div className="flex items-center gap-4 mt-8 font-mono text-[9px] text-slate-500 tracking-wider">
              <span className="uppercase">FOLLOW US</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#ff1a40] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#ff1a40] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#ff1a40] transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Empty Column on Desktop (lets the mecha/character bg shine) */}
          <div className="hidden md:block md:w-1/3 lg:w-1/2 pointer-events-none" />

        </div>

        {/* Bottom Mini Arcade Game */}
        <CircuitBreakoutGame />

      </div>
    </section>
  );
};
