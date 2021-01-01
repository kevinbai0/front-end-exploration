import { ColorKeys } from '../base/colors';
import { BaseFactory } from '../base/factory';
import { FontKeys } from '../base/fonts';
import { LayoutKeys } from '../base/layout';
import { MediableProperty, ThemeMedia } from '../base/media';
import { SpaceKeys, SpaceMultiplier } from '../base/spacing';

export type ColorPropNames = 'fg' | 'bg';
export type FontPropNames = 'font';
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
export type LayoutPropNames = 'layout';
export type SelectorPropNames<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = `$${Fact['media']['selectors'][number]}`;

export type DnaPropNames<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> =
  | ColorPropNames
  | FontPropNames
  | SpacePropNames
  | LayoutPropNames
  | SelectorPropNames<Media, Fact>;

export type SelectorProps<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [key in SelectorPropNames<Media, Fact>]?: Omit<
    ThemeDnaProps<Media, Fact>,
    SelectorPropNames<Media, Fact>
  >;
};

export type ColorProps<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [key in ColorPropNames]?: MediableProperty<
    ColorKeys<Fact['colors']>,
    Fact['media']
  >;
};

export type FontProps<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [key in FontPropNames]?: MediableProperty<
    FontKeys<Fact['media'], Fact['fonts']>,
    Fact['media']
  >;
};

export type SpaceProps<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [key in SpacePropNames]?: MediableProperty<
    SpaceKeys<Fact['spacing']> | SpaceMultiplier,
    Fact['media']
  >;
};

export type LayoutProps<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = {
  [key in LayoutPropNames]?: MediableProperty<LayoutKeys<Media, Fact>, Media>;
};

export type ThemeDnaProps<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> = ColorProps<Media, Fact> &
  SpaceProps<Media, Fact> &
  FontProps<Media, Fact> &
  LayoutProps<Media, Fact> &
  SelectorProps<Media, Fact>;
