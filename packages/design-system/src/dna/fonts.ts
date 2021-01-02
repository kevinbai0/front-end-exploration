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
  const { family, size, weight } = props.theme.fonts[prop];
  const fontFamily =
    props.theme.fontFamily[family as ThemeFontFamily<ThemeExtension>] || family;
  const fontSize =
    props.theme.fontSizes[size as ThemeFontSize<ThemeExtension>] ||
    parseInt(size);

  if (typeof fontSize === 'number') {
    return [`${weight} ${fontSize}px ${fontFamily}`];
  }

  return (fontSize as number[]).map(sz => `${weight} ${sz}px ${fontFamily}`);
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
  return [splitStyle('font', ['font'], matchFontToTheme, props, defaultProps)];
};
