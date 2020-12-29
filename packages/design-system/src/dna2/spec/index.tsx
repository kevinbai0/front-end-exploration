import { applyGenerator } from '../build';
import { toCSS } from '../build/css';
import { colorArray, generateColors } from './colors';
import { createFactory } from './factory';
import { generateFonts } from './fonts';
import { createSelectors, generateMedia } from './media';
import { generateSpacing } from './spacing';

const { media, mediaFn } = generateMedia({
  breakpoints: {
    tablet: '768px',
    desktop: '1024px',
    xLarge: '1440px',
  },
  selectors: createSelectors('$focus', '$hover', '$active'),
});

const colors = generateColors({
  white: '#ffffff',
  black: '#131313',
  greys: colorArray('#eeeeee', '#cccccc', '#aaaaaa', '#888888'),
});

const fonts = generateFonts<typeof media>()({
  families: {
    main: 'Calibri',
  },
  weights: {
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  sizeClasses: {
    h1: ['48px', '64px', '1.5px'],
    h2: ['32px', '48px', '1px'],
    h3: ['24px', '36px', '0.5px'],
    h4: ['20px', '28px', '0.25px'],
    h5: ['16px', '24px', '0.25px'],
    body: ['16px', '24px', '0.25px'],
    small: ['12px', '16px', '0.25px'],
  },
  fonts: {
    h1: {
      family: 'main',
      weight: 'bold',
      sizeClass: 'h1',
    },
    h2: {
      family: 'main',
      weight: 'normal',
      sizeClass: 'h2',
    },
    h3: {
      family: 'main',
      weight: 'normal',
      sizeClass: 'h3',
    },
    h4: {
      family: 'main',
      weight: 'normal',
      sizeClass: 'h4',
    },
  },
});

const spacing = generateSpacing<typeof media>()({
  baseMultiplier: (media) => media('8px'),
  aliases: {
    gap: '1x',
    appMarginX: '5x',
    cardPaddingX: '2x',
  },
});

const factory = createFactory({
  media,
  fonts,
  colors,
  spacing: spacing.aliases,
});

const applier = applyGenerator(mediaFn, factory);

const res = applier({
  bg: (media) => media('greys.1').tablet('black'),
  fg: 'greys.3',
  m: '2x',
  my: (media) => media('3x').tablet('2x').$focus('1x'),
  font: (media) => media('h3').$hover('h2').tablet('h2').$hover('h1'),
  $focus: {
    fg: (media) => media('black').tablet('white'),
  },
});

console.log(toCSS(res, media));
