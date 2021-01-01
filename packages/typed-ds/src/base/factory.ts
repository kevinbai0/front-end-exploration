import { StringKey } from '../types';
import { ThemeColors } from './colors';
import { ThemeFont, ThemeFontDefinition, ThemeFontAttributes } from './fonts';
import {
  ThemeLayout,
  ThemeLayoutAliases,
  ThemeLayoutProperties,
} from './layout';
import { MediaSelector, ThemeMedia } from './media';
import { ThemeSpacing } from './spacing';

export type BaseFactory<Media extends ThemeMedia> = IFactory<
  Media,
  ThemeColors,
  ThemeFontAttributes,
  ThemeFont<Media, ThemeFontAttributes>,
  ThemeFontDefinition<
    Media,
    ThemeFontAttributes,
    ThemeFont<Media, ThemeFontAttributes>
  >,
  ThemeSpacing,
  ThemeLayoutProperties<Media>,
  ThemeLayoutAliases<Media>,
  ThemeLayout<Media, ThemeLayoutProperties<Media>, ThemeLayoutAliases<Media>>
>;

export interface IFactory<
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes,
  Fonts extends ThemeFont<Media, FontAttributes>,
  FontDefinition extends ThemeFontDefinition<Media, FontAttributes, Fonts>,
  Space extends ThemeSpacing,
  LayoutProperties extends ThemeLayoutProperties<Media>,
  LayoutAlias extends ThemeLayoutAliases<Media>,
  Layout extends ThemeLayout<Media, LayoutProperties, LayoutAlias>
> {
  media: Media;
  fonts: FontDefinition;
  colors: Colors;
  spacing: Space;
  layout: Layout;
  rank: (StringKey<keyof Media['breakpoints']> | '_base')[];
  mediaFn: <T>() => MediaSelector<T, Media>;
}

export const createFactory = <
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes,
  Fonts extends ThemeFont<Media, FontAttributes>,
  FontDefinition extends ThemeFontDefinition<Media, FontAttributes, Fonts>,
  Space extends ThemeSpacing,
  LayoutProperties extends ThemeLayoutProperties<Media>,
  LayoutAlias extends ThemeLayoutAliases<Media>,
  Layout extends ThemeLayout<Media, LayoutProperties, LayoutAlias>
>(options: {
  media: Media;
  fonts: FontDefinition;
  colors: Colors;
  spacing: Space;
  layout: Layout;
}): IFactory<
  Media,
  Colors,
  FontAttributes,
  Fonts,
  FontDefinition,
  Space,
  LayoutProperties,
  LayoutAlias,
  Layout
> => {
  return {
    ...options,
    get rank() {
      return [
        '_base',
        ...Object.entries(options.media.breakpoints)
          .sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]))
          .map(val => val[0]),
      ] as (StringKey<keyof Media['breakpoints']> | '_base')[];
    },
    mediaFn: <T>() => {
      return [
        ...Object.keys(options.media.breakpoints),
        ...options.media.selectors,
      ].reduce<MediaSelector<T, Media>>((acc, breakpoint) => {
        return {
          ...acc,
          [breakpoint]: (val: T) => [val, breakpoint],
        };
      }, {} as MediaSelector<T, Media>);
    },
  };
};
