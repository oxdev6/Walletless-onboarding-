import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#09040C',
          core: '#1A0B1F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#BEBEC5',
        },
        brand: {
          from: '#4427EC',
          to:   '#A753EE',
        },
        surface: {
          secondary: '#574E5C',
          ghost: '#1E0C28',
        },
        stroke: {
          subtle: '#1B1120',
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(167,83,238,0.5)',
        'glow-secondary': '0 0 18px rgba(68,39,236,0.35)',
        'inner-soft': 'inset 0 0 0 1px rgba(255,255,255,0.06)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}
export default config


