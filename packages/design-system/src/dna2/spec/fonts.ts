import { AppBps, MediableProperty } from './media';
import { Size } from './types';

export type FontWeightPrimitive =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type FontSizeClass<Bps extends AppBps> = [
  size: MediableProperty<Size, Bps>,
  lineHeight: MediableProperty<Size, Bps>,
  letterSpacing: MediableProperty<Size, Bps>
];

export interface IFont<
  Bps extends AppBps,
  T extends string,
  Weight extends string,
  SizeClasses extends String
> {
  family: MediableProperty<T, Bps>;
  weight: MediableProperty<Weight, Bps>;
  sizeClass: MediableProperty<SizeClasses, Bps>;
}

type StringKey<T> = T extends string ? T : never;

export type ThemeFontFamily<Bps extends AppBps> = Record<
  string,
  MediableProperty<string, Bps>
>;
export type ThemeFontWeight<Bps extends AppBps> = Record<
  string,
  MediableProperty<FontWeightPrimitive, Bps>
>;
export type ThemeFontSizeClass<Bps extends AppBps> = Record<
  string,
  MediableProperty<FontSizeClass<Bps>, Bps>
>;
export type ThemeFont<
  Bps extends AppBps,
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>
> = Record<
  string,
  IFont<
    Bps,
    StringKey<keyof Families>,
    StringKey<keyof FontWeights>,
    StringKey<keyof SizeClasses>
  >
>;

export type ThemeFontDefinition<
  Bps extends AppBps,
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>,
  Fonts extends ThemeFont<Bps, Families, FontWeights, SizeClasses>
> = {
  base: {
    families: Families;
    weights: FontWeights;
    sizeClasses: SizeClasses;
  };
  fonts: Fonts;
};

export const generateFonts = <Bps extends AppBps>() => <
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>,
  Fonts extends ThemeFont<Bps, Families, FontWeights, SizeClasses>
>(options: {
  families: Families;
  weights: FontWeights;
  sizeClasses: SizeClasses;
  fonts: Fonts;
}): ThemeFontDefinition<Bps, Families, FontWeights, SizeClasses, Fonts> => {
  const { fonts, ...rest } = options;
  return {
    base: rest,
    fonts,
  };
};

export type FontKeys<
  Bps extends AppBps,
  Families extends ThemeFontFamily<Bps>,
  FontWeights extends ThemeFontWeight<Bps>,
  SizeClasses extends ThemeFontSizeClass<Bps>,
  Fonts extends ThemeFont<Bps, Families, FontWeights, SizeClasses>,
  D extends ThemeFontDefinition<Bps, Families, FontWeights, SizeClasses, Fonts>
> = keyof D['fonts'];
