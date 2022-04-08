import {
  ThemeFont,
  ThemeFontFamily,
  ThemeObject,
  ThemeFontSize,
  Font,
  DNA,
  ThemeExtension,
} from '../theme/types';
import { splitStyle } from './helpers';
import { InjectProperties } from './index';

const matchFontToTheme = (
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  prop: ThemeFont<ThemeExtension>
) => {
  if (!props.theme.fonts[prop]) return [];
  const { family, size, weight, lineHeight } = props.theme.fonts[prop];
  const fontFamily =
    props.theme.fontFamily[family as ThemeFontFamily<ThemeExtension>] || family;
  const fontSize =
    (props.theme.fontSizes[size as ThemeFontSize<ThemeExtension>] ||
    (() => {
      if (typeof size === 'string') {
        if (size.endsWith('em')) {
          return size;
        }
      }
      return parseInt(size)
    })()) as number | string | (number | string)[];

  const weightWithOverride = props.weight || weight;

  function renderAsPxOrRow(val: number | string) {
    return typeof val === 'number' ? `${val}px` : val
  }

  if (typeof fontSize === 'number' || typeof fontSize === 'string') {
    return [`${weightWithOverride} ${renderAsPxOrRow(fontSize)}/${renderAsPxOrRow(lineHeight)} ${fontFamily}`];
  }

  return (fontSize as (number | string)[]).map(
    sz => `${weightWithOverride} ${renderAsPxOrRow(sz)}/${renderAsPxOrRow(lineHeight)} ${fontFamily}`
  );
};

const getReactNativeFontSize = (
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  prop: ThemeFont<ThemeExtension>
) => {
  const { size } = props.theme.fonts[prop];

  const fontSize =
    props.theme.fontSizes[size as ThemeFontSize<ThemeExtension>] || [];

  if (typeof fontSize === 'number') {
    return `${fontSize}px`;
  }
  else if (typeof fontSize === 'string') {
    return fontSize;
  }
  return `14px`;
};

const getReactNativeFontFamily = (
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  prop: ThemeFont<ThemeExtension>
) => {
  const { family, weight } = props.theme.fonts[prop];
  const fontFamily =
    props.theme.fontFamily[family as ThemeFontFamily<ThemeExtension>] || family;

  const fontWeight = props.weight ?? weight;
  if (fontWeight === 700) {
    return `${fontFamily}-Bold`;
  } else if (fontWeight === 600) {
    return `${fontFamily}-SemiBold`;
  } else if (fontWeight === 500) {
    return `${fontFamily}-Medium`;
  }
  return `${fontFamily}-Regular`;
};

const matchLineHeightToTheme = (
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  prop: ThemeFont<ThemeExtension>
) => {
  if (!props.theme.fonts[prop]) return [];
  const { lineHeight } = props.theme.fonts[prop];
  return [`${lineHeight}px`];
};

const matchLetterSpacingToTheme = (
  props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>,
  prop: ThemeFont<ThemeExtension>
) => {
  if (!props.theme.fonts[prop]) return [];
  const { letterSpacing } = props.theme.fonts[prop];
  return [`${letterSpacing}px`];
};

export const injectFonts: InjectProperties<Font<ThemeExtension>> = (
  props,
  defaultProps,
  platform
) => {
  const allProps = { ...(defaultProps && defaultProps), ...props };
  if (platform === 'react-native') {
    return [
      {
        property: ['font-family'],
        value: props.font
          ? [getReactNativeFontFamily(allProps, props.font)]
          : [],
      },
      {
        property: ['font-size'],
        value: props.font ? [getReactNativeFontSize(allProps, props.font)] : [],
      },
      splitStyle(
        'font',
        ['line-height'],
        matchLineHeightToTheme,
        props,
        defaultProps
      ),
      splitStyle(
        'font',
        ['letter-spacing'],
        matchLetterSpacingToTheme,
        props,
        defaultProps
      ),
    ];
  }
  return [
    splitStyle('font', ['font'], matchFontToTheme, props, defaultProps),
    splitStyle(
      'font',
      ['letter-spacing'],
      matchLetterSpacingToTheme,
      props,
      defaultProps
    ),
  ];
};
