import { ThemeColors } from './colors';
import { ThemeFont, ThemeFontDefinition, ThemeFontAttributes } from './fonts';
import { ThemeMedia } from './media';
import { ThemeSpacing } from './spacing';

export type BaseFactory<Media extends ThemeMedia> = IFactory<
  Media,
  ThemeColors,
  ThemeFontAttributes,
  ThemeFont<Media, ThemeFontAttributes>,
  ThemeSpacing
>;

export interface IFactory<
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes,
  Fonts extends ThemeFont<Media, FontAttributes>,
  Space extends ThemeSpacing
> {
  media: Media;
  fonts: ThemeFontDefinition<Media, FontAttributes, Fonts>;
  colors: Colors;
  spacing: Space;
  rank: (keyof Media['breakpoints'] | '_base')[];
}

export const createFactory = <
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes,
  Fonts extends ThemeFont<Media, FontAttributes>,
  Space extends ThemeSpacing
>(options: {
  media: Media;
  fonts: ThemeFontDefinition<Media, FontAttributes, Fonts>;
  colors: Colors;
  spacing: Space;
}): IFactory<Media, Colors, FontAttributes, Fonts, Space> => {
  return {
    ...options,
    get rank() {
      return [
        '_base',
        ...Object.entries(options.media.breakpoints)
          .sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]))
          .map(val => val[0]),
      ];
    },
  };
};
