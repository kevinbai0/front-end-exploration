import { ThemeColors } from './colors';
import { ThemeFont, ThemeFontDefinition, ThemeFontAttributes } from './fonts';
import { ThemeMedia } from './media';
import { ThemeSpacing } from './spacing';

export interface IFactory<
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes<Media>,
  Fonts extends ThemeFont<Media, FontAttributes>,
  Space extends ThemeSpacing
> {
  media: Media;
  fonts: ThemeFontDefinition<Media, FontAttributes, Fonts>;
  colors: Colors;
  spacing: Space;
}

export const createFactory = <
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes<Media>,
  Fonts extends ThemeFont<Media, FontAttributes>,
  Space extends ThemeSpacing
>(options: {
  media: Media;
  fonts: ThemeFontDefinition<Media, FontAttributes, Fonts>;
  colors: Colors;
  spacing: Space;
}): IFactory<Media, Colors, FontAttributes, Fonts, Space> => {
  return options;
};
