import { ColorKeys, ThemeColors } from '../spec/colors';
import { IFactory } from '../spec/factory';
import {
  FontKeys,
  ThemeFontDefinition,
  ThemeFont,
  ThemeFontAttributes,
} from '../spec/fonts';
import { ThemeMedia, MediableProperty } from '../spec/media';
import { SpaceKeys, ThemeSpacing, SpaceMultiplier } from '../spec/spacing';

type ColorPropNames = 'fg' | 'bg';
type SpacePropNames =
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
type FontPropNames = 'font';
type SelectorPropNames<Media extends ThemeMedia> = Media['selectors'][number];

export type DnaPropNames<Media extends ThemeMedia> =
  | ColorPropNames
  | SpacePropNames
  | FontPropNames
  | SelectorPropNames<Media>;

export type SelectorProps<
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes<Media>,
  Fonts extends ThemeFont<Media, FontAttributes>,
  Space extends ThemeSpacing,
  Fact extends IFactory<Media, Colors, FontAttributes, Fonts, Space>
> = {
  [key in SelectorPropNames<Media>]?: Omit<
    DNAProps<Media, Colors, FontAttributes, Fonts, Space, Fact>,
    key
  >;
};

export type ColorProps<Colors extends ThemeColors, Media extends ThemeMedia> = {
  [key in ColorPropNames]?: MediableProperty<ColorKeys<Colors>, Media>;
};

export type SpaceProps<T extends ThemeSpacing, Media extends ThemeMedia> = {
  [key in SpacePropNames]?: MediableProperty<
    SpaceKeys<T> | SpaceMultiplier,
    Media
  >;
};

export type FontProps<
  Media extends ThemeMedia,
  FontAttributes extends ThemeFontAttributes<Media>,
  Fonts extends ThemeFont<Media, FontAttributes>,
  D extends ThemeFontDefinition<Media, FontAttributes, Fonts>
> = {
  [key in FontPropNames]?: MediableProperty<
    FontKeys<Media, FontAttributes, Fonts, D>,
    Media
  >;
};

export type DNAProps<
  Media extends ThemeMedia,
  Colors extends ThemeColors,
  FontAttributes extends ThemeFontAttributes<Media>,
  Fonts extends ThemeFont<Media, FontAttributes>,
  Space extends ThemeSpacing,
  Fact extends IFactory<Media, Colors, FontAttributes, Fonts, Space>
> = ColorProps<Fact['colors'], Media> &
  SpaceProps<Fact['spacing'], Media> &
  FontProps<Media, FontAttributes, Fonts, Fact['fonts']> &
  SelectorProps<Media, Colors, FontAttributes, Fonts, Space, Fact>;
