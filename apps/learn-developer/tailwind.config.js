const { theme, safelist, plugins } = require('../../tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/access/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme,
  safelist,
  plugins,
};
