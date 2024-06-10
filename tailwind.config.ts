import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    fontFamily: {
      clashDisplay_extraLight: ['ClashDisplay-Extralight'],
      clashDisplay_light: ['ClashDisplay-Light'],
      clashDisplay_regular: ['ClashDisplay-Regular'],
      clashDisplay_medium: ['ClashDisplay-Medium'],
      clashDisplay_semibold: ['ClashDisplay-Semibold'],
      clashDisplay_bold: ['ClashDisplay-Bold'],
    },
  },
  plugins: [],
};
export default config;
