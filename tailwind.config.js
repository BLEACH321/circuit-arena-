/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#07080c',
          panel: '#0e111a',
          card: '#121624',
          cardBorder: '#1e2438',
          orange: '#ff6b00',
          orangeGlow: '#ff8800',
          amber: '#ffb700',
          cyan: '#00f0ff',
          cyanGlow: '#5ce1e6',
          green: '#00ff66',
          red: '#ff2a5f',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Chakra Petch', 'Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 107, 0, 0.4), inset 0 0 5px rgba(255, 107, 0, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 107, 0, 0.8), inset 0 0 15px rgba(255, 107, 0, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
