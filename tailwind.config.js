/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'retro-purple': '#9333ea',
        'retro-pink': '#ec4899',
        'retro-blue': '#3b82f6',
        'retro-green': '#10b981',
        'retro-yellow': '#f59e0b',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'retro-glow': 'retro-glow 2s ease-in-out infinite',
        'vhs-flicker': 'vhs-flicker 0.15s ease-in-out infinite alternate',
        'neon-pulse': 'neon-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'retro-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(147, 51, 234, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' },
        },
        'vhs-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        'neon-pulse': {
          '0%, 100%': { 
            textShadow: '0 0 5px rgba(147, 51, 234, 0.5), 0 0 10px rgba(147, 51, 234, 0.3), 0 0 15px rgba(147, 51, 234, 0.2)' 
          },
          '50%': { 
            textShadow: '0 0 10px rgba(147, 51, 234, 0.8), 0 0 20px rgba(147, 51, 234, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)' 
          },
        },
      },
    },
  },
  plugins: [],
}
