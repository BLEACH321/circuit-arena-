import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse position state inside canvas context
    const mouse = {
      x: 0,
      y: 0,
      active: false
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn new trail sparks on movement
      for (let i = 0; i < 2; i++) {
        sparks.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.6, // drift slightly upward like embers
          radius: Math.random() * 2 + 1,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          alpha: 1.0,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle nodes definition (smaller background dots)
    const particleCount = Math.min(Math.floor(width / 22), 65);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }> = [];

    const colors = ['#ff1a40', '#ff4d6d', '#ff758f', '#9a031e'];
    const sparkColors = ['#ff1a40', '#ff4d6d', '#ff758f', '#ff0055'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Floating Cyber Coins definitions
    const coins: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      rotation: number;
      rotationSpeed: number;
      pulse: number;
      pulseSpeed: number;
    }> = [];

    const coinCount = Math.min(Math.floor(width / 240), 6);
    for (let i = 0; i < coinCount; i++) {
      coins.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 8 + 14, // 14px to 22px radius
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008
      });
    }

    // Interactive mouse trail sparks array
    let sparks: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }> = [];

    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint circuit grid
      gridOffset = (gridOffset + 0.15) % 40;
      ctx.strokeStyle = 'rgba(255, 26, 64, 0.02)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw active connections from mouse to nearby particles
      if (mouse.active) {
        ctx.lineWidth = 0.9;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.18; // fade out with distance
            ctx.strokeStyle = `rgba(255, 77, 109, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            
            // Draw angular cyber-style lines
            if (i % 2 === 0) {
              ctx.lineTo(mouse.x, p.y);
            }
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw floating network particles & links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.025;

        // Bounce off bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const currentRadius = p.radius + Math.sin(p.pulse) * 0.4;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, currentRadius), 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes with circuit lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.07;
            ctx.strokeStyle = `rgba(255, 26, 64, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);

            // Right-angle circuit style connection
            if (i % 2 === 0) {
              ctx.lineTo(p.x, p2.y);
            }
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw cyber-coins
      for (let i = 0; i < coins.length; i++) {
        const c = coins[i];
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;
        c.pulse += c.pulseSpeed;

        // Wrap around bounds with margins
        const margin = c.radius * 2;
        if (c.x < -margin) c.x = width + margin;
        if (c.x > width + margin) c.x = -margin;
        if (c.y < -margin) c.y = height + margin;
        if (c.y > height + margin) c.y = -margin;

        // Pulse opacity for glow
        const currentOpacity = 0.16 + Math.sin(c.pulse) * 0.08;

        ctx.save();
        ctx.strokeStyle = `rgba(255, 26, 64, ${currentOpacity})`;
        ctx.shadowColor = '#ff1a40';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.6;

        // 1. Outer Coin Rim
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Inner Ring
        ctx.strokeStyle = `rgba(255, 77, 109, ${currentOpacity * 0.6})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Central Solid Core
        ctx.fillStyle = `rgba(255, 117, 143, ${currentOpacity * 0.85})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // 4. Rotating Crosshair detail lines
        ctx.strokeStyle = `rgba(255, 26, 64, ${currentOpacity * 0.75})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const angle = c.rotation + (j * Math.PI) / 2;
          const startX = c.x + Math.cos(angle) * (c.radius * 0.35);
          const startY = c.y + Math.sin(angle) * (c.radius * 0.35);
          const endX = c.x + Math.cos(angle) * (c.radius * 0.85);
          const endY = c.y + Math.sin(angle) * (c.radius * 0.85);
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
        }
        ctx.stroke();

        ctx.restore();
      }

      // Update, draw, and filter mouse trail sparks
      sparks = sparks.filter(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) return false;

        ctx.save();
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};

export default ParticleBackground;
