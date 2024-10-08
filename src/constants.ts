export const REVALIDATE_TIME = 600;
export const ONE_WEEK_TIME = 3600 * 24 * 7;
type Theme = Record<string, any>;
export const NOTION_COLOR_SCHEME: Theme = {
  light: {
    text: {
      default: '#37352F',
      gray: '#9B9A97',
      brown: '#64473A',
      orange: '#D9730D',
      yellow: '#DFAB01',
      green: '#0F7B6C',
      blue: '#0B6E99',
      purple: '#6940A5',
      pink: '#AD1A72',
      red: '#E03E3E',
    },
    bg: {
      default: '#FFFFFF',
      gray: '#EBECED',
      brown: '#E9E5E3',
      orange: '#FAEBDD',
      yellow: '#FBF3DB',
      green: '#DDEDEA',
      blue: '#DDEBF1',
      purple: '#EAE4F2',
      pink: '#F4DFEB',
      red: '#FBE4E4',
    },
  },
  dark: {
    text: {
      default: 'rgba(255,255,255,0.9)',
      gray: 'rgba(151,154,155,0.95)',
      brown: 'rgba(147,114,100,1)',
      orange: 'rgba(255,163,68,1)',
      yellow: 'rgba(255,220,73,1)',
      green: 'rgba(77,171,154,1)',
      blue: 'rgba(82,156,202,1)',
      purple: 'rgba(154,109,215,1)',
      pink: 'rgba(226,85,161,1)',
      red: 'rgba(255,115,105,1)',
    },
    bg: {
      default: '#2F3437',
      gray: '#454B4E',
      brown: '#434040',
      orange: '#594A3A',
      yellow: '#59563B',
      green: '#354C4B',
      blue: '#364954',
      purple: '#443F57',
      pink: '#533B4C',
      red: '#594141',
    },
  },
};
