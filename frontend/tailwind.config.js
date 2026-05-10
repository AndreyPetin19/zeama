/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        zeama: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#1E1B4B',
        },
        reward: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)',
        'card-hover':'0 4px 8px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.10)',
        pill:       '0 2px 12px rgba(245,158,11,0.45)',
        glow:       '0 0 0 3px rgba(139,92,246,0.25)',
        'zeama':    '0 4px 24px rgba(124,58,237,0.18)',
      },
      animation: {
        'fade-up':    'fadeUp 0.45s cubic-bezier(0.23,1,0.32,1) forwards',
        'fade-in':    'fadeIn 0.3s ease-out forwards',
        'scale-in':   'scaleIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards',
        'bounce-in':  'bounceIn 0.55s cubic-bezier(0.23,1,0.32,1) forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'count-up':   'fadeUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '60%':  { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.65' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
