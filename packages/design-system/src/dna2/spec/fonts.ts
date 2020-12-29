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

export type FontSizeClass<Media extends ThemeMedia> = [
  size: MediableProperty<Size, Media>,
  lineHeight: MediableProperty<Size, Media>,
  letterSpacing: MediableProperty<Size, Media>
];

export interface IFont<
  Media extends ThemeMedia,
  Attributes extends ThemeFontAttributes<Media>
> {
  family: MediableProperty<StringKey<keyof Attributes['families']>, Media>;
  weight: MediableProperty<StringKey<keyof Attributes['weights']>, Media>;
  sizeClass: MediableProperty<
    StringKey<keyof Attributes['sizeClasses']>,
    Media
  >;
}

export type ThemeFontAttributes<Media extends ThemeMedia> = {
  families: ThemeFontFamily<Media>;
  weights: ThemeFontWeight<Media>;
  sizeClasses: ThemeFontSizeClass<Media>;
};

export type ThemeFontFamily<Media extends ThemeMedia> = Record<
  string,
  MediableProperty<string, Media>
>;
export type ThemeFontWeight<Media extends ThemeMedia> = Record<
  string,
  MediableProperty<FontWeightPrimitive, Media>
>;
export type ThemeFontSizeClass<Media extends ThemeMedia> = Record<
  string,
  MediableProperty<FontSizeClass<Media>, Media>
>;
export type ThemeFont<
  Media extends ThemeMedia,
  FontAttributes extends ThemeFontAttributes<Media>
> = Record<string, IFont<Media, FontAttributes>>;

export type ThemeFontDefinition<
  Media extends ThemeMedia,
  FontAttributes extends ThemeFontAttributes<Media>,
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
  FontAttributes extends {
    families: ThemeFontFamily<Media>;
    weights: ThemeFontWeight<Media>;
    sizeClasses: ThemeFontSizeClass<Media>;
  },
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
  FontAttributes extends {
    families: ThemeFontFamily<Media>;
    weights: ThemeFontWeight<Media>;
    sizeClasses: ThemeFontSizeClass<Media>;
  },
  Fonts extends ThemeFont<Media, FontAttributes>,
  D extends ThemeFontDefinition<Media, FontAttributes, Fonts>
> = keyof D['fonts'];
