const shadcnPlugin = require('./shadcn-plugin');
const animatePlugin = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [],
  plugins: [animatePlugin, shadcnPlugin],
};
