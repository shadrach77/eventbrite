/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryOrange: 'rgb(240, 85, 55)',
        secondaryOrange: 'rgb(159, 44, 21)',
        secondaryBackground: 'rgb(248, 247, 250)',
        secondaryText: 'rgb(57, 54, 79)',
        blueAccent: 'rgb(54, 89, 227)',
      },
    },
  },
  plugins: [],
};
