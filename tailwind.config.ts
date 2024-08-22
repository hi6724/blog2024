import type { Config } from 'tailwindcss';
const plugin = require('tailwindcss/plugin');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      textShadow: {
        DEFAULT: '2px 2px 6px color-mix(in lch, var(--tw-shadow-color), transparent 60%)',
      },
    },
    colors: {},
    fontFamily: {
      letter: ['var(--oranienbaum)', 'eunbyul', 'g-sans', 'var(--ibm-sans)', 'var(--sans)', 'var(--roboto)'],
      eunbyul: ['eunbyul', 'g-sans', 'var(--ibm-sans)', 'var(--sans)', 'var(--roboto)'],
      sans: ['g-sans', 'var(--ibm-sans)', 'var(--sans)', 'var(--roboto)'],
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'text-shadow': (value: any) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }),

    require('tailwind-scrollbar-hide'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ['emerald', 'garden', 'night', 'dim'],
  },
};
export default config;
