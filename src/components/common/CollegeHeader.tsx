import React from 'react';
import collegeHeaderImg from '../../assets/college_header.png';

export const CollegeHeader: React.FC = () => {
  return (
    <div className="w-full bg-black border-b border-white/5 relative z-40 select-none animate-header-glow">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes headerGlowPulse {
          0%, 100% {
            border-color: rgba(0, 240, 255, 0.1);
            box-shadow: 0 1px 10px rgba(0, 240, 255, 0.05);
          }
          50% {
            border-color: rgba(255, 26, 64, 0.25);
            box-shadow: 0 1px 20px rgba(255, 26, 64, 0.15);
          }
        }
        .animate-header-glow {
          animation: headerGlowPulse 4s ease-in-out infinite;
        }
        
        @keyframes textGlitch {
          0%, 100% { transform: translate(0); }
          33% { transform: translate(1px, -0.5px); }
          66% { transform: translate(-1px, 0.5px); }
        }
        .hover-glitch:hover {
          animation: textGlitch 0.3s linear infinite;
        }
      `}} />

      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-20 md:h-24">
        
        {/* Left Logo - Vidyavardhini */}
        <div 
          className="h-full aspect-square bg-contain transition-all duration-500 cursor-pointer hover:scale-105 hover:filter hover:drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
          style={{ 
            backgroundImage: `url(${collegeHeaderImg})`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Center Text Details */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4 md:px-8">
          <h1 className="text-[10px] sm:text-xs md:text-base font-black tracking-wider text-white uppercase font-display hover-glitch transition-colors duration-300 hover:text-[#00f0ff] cursor-default">
            Vidyavardhini's College of Engineering & Technology
          </h1>
          <p className="text-[6px] sm:text-[8px] md:text-xs text-slate-400 font-mono tracking-widest mt-0.5 sm:mt-1 uppercase opacity-80">
            K.T. Marg, Vasai Road (West), Dist. Palghar — 401202, Maharashtra.
          </p>
        </div>

        {/* Right Logo - IIC */}
        <div 
          className="h-full aspect-[2.2/1] bg-contain transition-all duration-500 cursor-pointer hover:scale-105 hover:filter hover:drop-shadow-[0_0_12px_rgba(255,26,64,0.4)]"
          style={{ 
            backgroundImage: `url(${collegeHeaderImg})`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat'
          }}
        />

      </div>
    </div>
  );
};

export default CollegeHeader;
