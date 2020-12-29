import { Color, ColorKeys } from '../spec/colors';
import {
  FontKeys,
  ThemeFontDefinition,
  ThemeFontFamily,
  ThemeFontSizeClass,
  ThemeFontWeight,
  ThemeFont,
} from '../spec/fonts';
import { AppBps, MediableProperty } from '../spec/media';
import { SpaceKeys, SpaceMultiplier } from '../spec/spacing';

export type ColorPropNames = 'fg' | 'bg';
export type SpacePropNames =
  | 'm'
  | 'p'
  | 'mx'
  | 'my'
  | 'px'
  | 'py'
  | 'mt'
  | 'mb'
  | 'ml'
  | 'mr'
  | 'pb'
  | 'pt'
  | 'pr'
  | 'pl';
export type FontPropNames = 'font';

export type ColorProps<C extends Record<string, Color>, Bps extends AppBps> = {
  [key in ColorPropNames]?: MediableProperty<ColorKeys<C>, Bps>;
};

export type SpaceProps<
  T extends Record<string, SpaceMultiplier>,
  Bps extends AppBps
> = {
  [key in SpacePropNames]?: MediableProperty<
    SpaceKeys<T> | SpaceMultiplier,
    Bps
  >;
};

export type FontProps<
  Bps extends AppBps,
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>,
  Fonts extends ThemeFont<Bps, Families, FontWeights, SizeClasses>,
  D extends ThemeFontDefinition<Bps, Families, FontWeights, SizeClasses, Fonts>
> = {
  [key in FontPropNames]?: MediableProperty<
    FontKeys<Bps, Families, FontWeights, SizeClasses, Fonts, D>,
    Bps
  >;
};
