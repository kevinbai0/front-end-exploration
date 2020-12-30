import { StringKey } from '../types';
import { ThemeMedia, MediableProperty } from './media';
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

export type FontSizeClass = [size: Size, lineHeight: Size, letterSpacing: Size];

export interface IFont<
  Media extends ThemeMedia,
  Attributes extends ThemeFontAttributes
> {
  family: MediableProperty<StringKey<keyof Attributes['families']>, Media>;
  weight: MediableProperty<StringKey<keyof Attributes['weights']>, Media>;
  sizeClass: MediableProperty<
    StringKey<keyof Attributes['sizeClasses']>,
    Media
  >;
}

export type ThemeFontAttributes = {
  families: ThemeFontFamily;
  weights: ThemeFontWeight;
  sizeClasses: ThemeFontSizeClass;
};

export type ThemeFontFamily = Record<string, string>;
export type ThemeFontWeight = Record<string, FontWeightPrimitive>;
export type ThemeFontSizeClass = Record<string, FontSizeClass>;
export type ThemeFont<
  Media extends ThemeMedia,
  FontAttributes extends ThemeFontAttributes
> = Record<string, IFont<Media, FontAttributes>>;

export type ThemeFontDefinition<
  Media extends ThemeMedia,
  FontAttributes extends ThemeFontAttributes,
  Fonts extends ThemeFont<Media, FontAttributes>
> = {
  base: Pick<
    FontAttributes & {
      fonts: Fonts;
    },
    Exclude<keyof FontAttributes, 'fonts'>
  >;
  fonts: Fonts;
};

export const generateFonts = <Media extends ThemeMedia>() => <
  FontAttributes extends ThemeFontAttributes,
  Fonts extends ThemeFont<Media, FontAttributes>
>(
  options: FontAttributes & {
    fonts: Fonts;
  }
): ThemeFontDefinition<Media, FontAttributes, Fonts> => {
  const { fonts, ...rest } = options;
  return {
    base: rest,
    fonts,
  };
};

export type FontKeys<
  Media extends ThemeMedia,
  FontDefinition extends ThemeFontDefinition<
    Media,
    ThemeFontAttributes,
    ThemeFont<Media, ThemeFontAttributes>
  >
> = StringKey<keyof FontDefinition['fonts']>;
