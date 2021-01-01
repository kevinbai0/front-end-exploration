import { applyGenerator } from '../../process';
import { ThemeDnaProps } from '../../process/types';
import { createCSSTransformer } from '../../transforms/merge/css';
import { createCssInJsTransformer } from '../../transforms/merge/css-in-js';
import * as colorsFactory from '../colors';
import * as themeFactory from '../factory';
import * as fontFactory from '../fonts';
import * as layoutFactory from '../layout';
import * as mediaFactory from '../media';
import * as spaceFactory from '../spacing';

export const media = mediaFactory.generate({
  breakpoints: {
    tablet: '768px',
    desktop: '1024px',
    xLarge: '1440px',
  },
  selectors: mediaFactory.createSelectors('focus', 'hover', 'active'),
});

const colors = colorsFactory.generate({
  white: '#ffffff',
  black: '#131313',
  greys: colorsFactory.colorArray('#eeeeee', '#cccccc', '#aaaaaa', '#888888'),
});

const fonts = fontFactory.generate<typeof media>()({
  properties: {
    family: {
      main: 'Calibri',
    },
    weight: {
      normal: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
    sizeClass: {
      h1: ['48px', '64px', '1.5px'],
      h2: ['32px', '48px', '1px'],
      h3: ['24px', '36px', '0.5px'],
      h4: ['20px', '28px', '0.25px'],
      h5: ['16px', '24px', '0.25px'],
      body: ['16px', '24px', '0.25px'],
      small: ['12px', '16px', '0.25px'],
    },
  },
  aliases: {
    h1: {
      family: 'main',
      weight: 'bold',
      sizeClass: 'h1',
    },
    h2: {
      family: 'main',
      weight: _ => ['normal', _.tablet('bold')],
      sizeClass: _ => ['h2', _.desktop('h1')],
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

const spacing = spaceFactory.generate({
  baseMultiplier: '8px',
  aliases: {
    gap: '1x',
    'app-margin-x': '5x',
    'card-padding-x': '2x',
  },
});

const layout = layoutFactory.generate<typeof media>()({
  properties: {
    display: {
      row: 'row',
      col: 'column',
    },
    align: {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
    },
    justify: {
      justify: 'space-between',
      evenly: 'space-evenly',
    },
  },
  aliases: {},
});

export const factory = themeFactory.generate({
  media,
  fonts,
  colors,
  spacing,
  layout,
});

const cssInJsTransformer = createCssInJsTransformer<
  typeof media,
  typeof factory
>();
const cssTransformer = createCSSTransformer<typeof media, typeof factory>();

const cssInJsApplier = applyGenerator(media, factory, cssInJsTransformer);
const cssApplier = applyGenerator(media, factory, cssTransformer);

const style: ThemeDnaProps<typeof media, typeof factory> = {
  bg: 'white',
  fg: 'greys.3',
  m: _ => ['2x', _.desktop('3x')],
  font: _ => ['h2', _.desktop('h3'), _.hover('h4')],
  layout: _ => ['row:start', _.tablet('col:center:evenly')],
  $active: {
    bg: _ => ['white', _.desktop('greys.3')],
  },
  $hover: {
    fg: 'greys.2',
  },
};

const cssInJs = cssInJsApplier(style);
const css = cssApplier(style);

console.log(cssInJs);
console.log(css);
