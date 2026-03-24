/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/**/*.{js,ts,jsx,tsx}',
    './packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        accent: '#C77DDB',
        neutral: '#F8F9FA',
        charcoal: '#24272a',
        'pastel-blue-light': '#B8D4F1',
        'pastel-blue': '#9BC4E9',
        'pastel-lavender-light': '#D5C6E8',
        'pastel-lavender': '#C2A9D9',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  safelist: [
    {
      pattern: /^(bg|text|border)-(primary|accent|neutral|charcoal)/,
    },
    {
      pattern:
        /^(bg|text|border)-(blue|purple|green|red|yellow|orange|gray)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [],
};
