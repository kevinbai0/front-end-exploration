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
  family: MediableProperty<StringKey<keyof Attributes['family']>, Media>;
  weight: MediableProperty<StringKey<keyof Attributes['weight']>, Media>;
  sizeClass: MediableProperty<StringKey<keyof Attributes['sizeClass']>, Media>;
}

export type ThemeFontAttributes = {
  family: ThemeFontFamily;
  weight: ThemeFontWeight;
  sizeClass: ThemeFontSizeClass;
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
  properties: FontAttributes;
  aliases: Fonts;
};

export const generateFonts = <Media extends ThemeMedia>() => <
  FontAttributes extends ThemeFontAttributes,
  Fonts extends ThemeFont<Media, FontAttributes>,
  FontDefinition extends ThemeFontDefinition<Media, FontAttributes, Fonts>
>(
  options: FontDefinition
): FontDefinition => {
  const { properties, aliases } = options;
  return {
    properties,
    aliases,
  } as FontDefinition;
};

export type FontKeys<
  Media extends ThemeMedia,
  FontDefinition extends ThemeFontDefinition<
    Media,
    ThemeFontAttributes,
    ThemeFont<Media, ThemeFontAttributes>
  >
> = StringKey<keyof FontDefinition['aliases']>;
