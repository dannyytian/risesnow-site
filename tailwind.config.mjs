/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'snow-white': '#FFFFFF',
        'bg-light': '#F8F9FA',
        'platinum': {
          DEFAULT: '#E5E4E2',
          light: '#F5F5F4',
        },
        'brand-blue': '#003366', // 海军蓝
        'accent-yellow': '#FFD700', // 亮黄色
        'brand-black': '#1A1A1A',
      },
      fontFamily: {
        'serif': ['"Songti SC"', 'STSong', 'SimSun', 'serif'], 
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
      spacing: {
        'screen-80': '80vh',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}