import React from 'react';

export const BackgroundVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-80">
      
      {/* CSS Animation to delay and fade in the video smoothly, hiding initial player states */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes iframeFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-iframe-fade-in {
          animation: iframeFadeIn 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: 2.5s;
          opacity: 0;
        }
      `}} />

      {/* Dark gradient overlay layer to preserve text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080c]/50 via-transparent to-[#07080c]/80 z-10 pointer-events-none" />

      {/* Transparent click-interceptor overlay to prevent pointer events from reaching the iframe */}
      <div className="absolute inset-0 z-20 pointer-events-auto bg-transparent" />

      {/* 
        Full-Screen Infinite Looping Game Background Video.
        Uses exact 16:9 aspect ratio math and 50% centering translates to crop 
        and scale the iframe, fitting it perfectly to the background of any screen width/height.
        Fades in after 2.5 seconds to hide YouTube load black frames, play/pause controls, and loading overlays.
      */}
      <iframe
        id="game-background-video"
        className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none border-0 z-0 animate-iframe-fade-in"
        style={{
          transform: 'translate(-50%, -50%) scale(1.18)'
        }}
        src="https://www.youtube-nocookie.com/embed/DiSDlPc7r0g?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&iv_load_policy=3&autohide=1&loop=1&playlist=DiSDlPc7r0g&playsinline=1&enablejsapi=0&start=30"
        title="Circuit Arena Game Background Video"
        allow="autoplay; encrypted-media; picture-in-picture"
        tabIndex={-1}
      />
    </div>
  );
};

export default BackgroundVideo;
