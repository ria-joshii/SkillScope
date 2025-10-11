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
        // RWJ Color Scheme
        'rwj-red': '#c41e3a',
        'rwj-red-dark': '#a0172e',
        'rwj-red-light': '#e74c3c',
        'rwj-white': '#ffffff',
        'rwj-black': '#000000',
        'rwj-gray-dark': '#2c2c2c',
        'rwj-gray-medium': '#666666',
        'rwj-gray-light': '#f5f5f5',
        'rwj-gray-border': '#e0e0e0',
        'rwj-accent': '#ff6b6b',
        'rwj-success': '#27ae60',
        'rwj-warning': '#f39c12',
        'rwj-error': '#e74c3c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-up': 'slideInUp 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'progress-shimmer': 'progressShimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        progressShimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      },
      boxShadow: {
        'rwj': '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
        'rwj-lg': '0 16px 48px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15)',
        'rwj-red': '0 4px 16px rgba(196, 30, 58, 0.3)',
        'rwj-red-lg': '0 8px 24px rgba(196, 30, 58, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
