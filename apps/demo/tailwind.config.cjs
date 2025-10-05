module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: { 
    extend: {
      colors: {
        // Exact palette from screenshot brief
        brand: {
          purple: '#4427EC',
          pink: '#A753EE',
          textSecondary: '#BEBEC5',
          bgDark: '#09040C',
          bgOverlay: '#1A0B1F'
        }
      }
    } 
  },
  plugins: [],
};
