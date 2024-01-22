const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const shadcnPreset = require('../../../tailwind-plugins/shadcn-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [shadcnPreset],
  plugins: [],
};
