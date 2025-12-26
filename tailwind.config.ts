/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#0b0b0c'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)',
        glass: '0 4px 30px rgba(0,0,0,0.25)',
        deep: '0 30px 80px rgba(0,0,0,0.45)'
      },
      backdropBlur: {
        xl: '12px'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
