/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0F',
          surface: '#111118',
          elevated: '#16161F',
        },
        border: {
          DEFAULT: '#1E1E2E',
          subtle: '#151520',
        },
        accent: {
          purple: '#6C5CE7',
          cyan: '#00D2FF',
          glow: 'rgba(108,92,231,0.3)',
        },
        status: {
          success: '#00B894',
          warning: '#FDCB6E',
          danger: '#E17055',
          info: '#74B9FF',
        },
        text: {
          primary: '#EDEDED',
          secondary: '#9B9BB4',
          muted: '#4A4A6A',
        },
        platform: {
          meta: '#1877F2',
          google: '#EA4335',
          linkedin: '#0A66C2',
          newspaper: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(108, 92, 231, 0.3)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 210, 255, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'fade-in-up': 'fadeInUp 0.3s ease forwards',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(108, 92, 231, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(108, 92, 231, 0.6)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
