import { ITheme, ThemeExtension } from './types';

const breakpoints = [0, 768, 1024, 1440];

const colors = {
  theme: '#004CA4',
  themeTint: '#094584',
  action: '#1387F2',
  actionTint: '#54A5F0',
  actionLight: '#68B7FF',
  alert: '#F33E3E',
  white: '#FFFFFF',
  black: '#333333',
  light: '#FAFAFA',
  soft: '#DFDFDF',
  'grey.0': '#F4F4F4',
  'grey.1': '#CCCCCC',
  'grey.2': '#AAAAAA',
  'grey.3': '#888888',
  orange: '#E0632B',
  red: '#C52F1A',
  green: '#649A2C',
  moneyGreen: '#74BB29',
  purple: '#774CE0',
  blue: '#283DB0',
  transparent: 'transparent',
};

const fontFamily = {
  mainFont: 'Lato',
};

const fontSizes = {
  header1: 42,
  header2: 30,
  header3: 24,
  header4: 18,
  header5: 16,
  bodyBig: 18,
  body: 14,
  bodySmall: 10,
};

const fonts = {
  header1: {
    family: 'mainFont',
    size: 'header1',
    weight: 700,
    lineHeight: 64,
    letterSpacing: 1.5,
  },
  header2: {
    family: 'mainFont',
    size: 'header2',
    weight: 700,
    lineHeight: 42,
    letterSpacing: 1,
  },
  header3: {
    family: 'mainFont',
    size: 'header3',
    weight: 700,
    lineHeight: 36,
    letterSpacing: 0.25,
  },
  header4: {
    family: 'mainFont',
    size: 'header4',
    weight: 600,
    lineHeight: 28,
    letterSpacing: 0.25,
  },
  header5: {
    family: 'mainFont',
    size: 'header5',
    weight: 500,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  body: {
    family: 'mainFont',
    size: 'body',
    weight: 400,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodyBig: {
    family: 'mainFont',
    size: 'bodyBig',
    weight: 400,
    lineHeight: 28,
    letterSpacing: 0.25,
  },
  bodySmall: {
    family: 'mainFont',
    size: 'bodySmall',
    weight: 400,
    lineHeight: 14,
    letterSpacing: 0.25,
  },
};

const shadows = {
  light: `0 0 30px rgba(0,0,0,0.07);`,
  default: `0 2px 10px rgba(0,0,0,0.2);`,
  active: `0 2px 20px rgba(0,0,0,0.3);`,
};

const space = {
  none: 0,
  nudge: 2,
  shift: 5,
  push: [5, 5, 5, 10],
  breathe: [10, 10, 10, 20],
  gap: [20, 20, 20, 40],
};

const borderRadius = {
  none: 0,
  minimal: 5,
  small: 10,
  default: 14,
  big: 25,
};

const borders = {
  none: 'none',
  ghost: {
    width: 1,
    style: 'solid',
    color: 'grey.4',
  },
  action: {
    width: 1,
    style: 'solid',
    color: 'action',
  },
  default: {
    width: 1,
    style: 'solid',
    color: 'black',
  },
  mobileOutline: [
    { width: 1, style: 'solid', color: 'foreground' },
    { width: 1, style: 'solid', color: 'foreground' },
    { width: 1, style: 'solid', color: 'foreground' },
    'none',
  ],
};

const defaultTheme = {
  breakpoints,
  colors,
  fonts,
  fontFamily,
  fontSizes,
  space,
  borderRadius,
  shadows,
  borders,
  layout: {
    row: `
      display: flex;
      flex-direction: row;
    `,
    col: `
      display: flex;
      flex-direction: column;
    `,
    box: `
      display: flex;
    `,
  },
};

export type InitialTheme = typeof defaultTheme;

export const createTheme = <NewTheme extends Partial<ITheme<ThemeExtension>>>(props: NewTheme) => {
  return extendTheme(props);
};

const extendTheme = <T extends Partial<ITheme<ThemeExtension>>>(
  themeOptions: T
): ITheme<T> => {
  return {
    ...themeOptions,
    breakpoints: [...defaultTheme.breakpoints],
    colors: {
      ...defaultTheme.colors,
      ...themeOptions.colors,
    },
    space: {
      ...defaultTheme.space,
      ...themeOptions.space,
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      ...themeOptions.fontFamily,
    },
    fontSizes: {
      ...defaultTheme.fontSizes,
      ...themeOptions.fontSizes,
    },
    fonts: {
      ...defaultTheme.fonts,
      ...themeOptions.fonts,
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      ...themeOptions.borderRadius,
    },
    borders: {
      ...defaultTheme.borders,
      ...themeOptions.borders,
    },
    shadows: {
      ...defaultTheme.shadows,
      ...themeOptions.shadows,
    },
    layout: {
      ...defaultTheme.layout,
      ...themeOptions.layout,
    },
  };
};
