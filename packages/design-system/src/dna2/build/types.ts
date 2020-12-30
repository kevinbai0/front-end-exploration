import { ColorKeys } from '../spec/colors';
import { BaseFactory } from '../spec/factory';
import { FontKeys } from '../spec/fonts';
import { MediableProperty } from '../spec/media';
import { SpaceKeys, SpaceMultiplier } from '../spec/spacing';

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
export type SelectorPropNames<
  Fact extends BaseFactory
> = `$${Fact['media']['selectors'][number]}`;

export type DnaPropNames<Fact extends BaseFactory> =
  | ColorPropNames
  | SpacePropNames
  | FontPropNames
  | SelectorPropNames<Fact>;

export type SelectorProps<Fact extends BaseFactory> = {
  [key in SelectorPropNames<Fact>]?: Omit<
    ThemeDnaProps<Fact>,
    SelectorPropNames<Fact>
  >;
};

export type ColorProps<Fact extends BaseFactory> = {
  [key in ColorPropNames]?: MediableProperty<
    ColorKeys<Fact['colors']>,
    Fact['media']
  >;
};

export type SpaceProps<Fact extends BaseFactory> = {
  [key in SpacePropNames]?: MediableProperty<
    SpaceKeys<Fact['spacing']> | SpaceMultiplier,
    Fact['media']
  >;
};

export type FontProps<Fact extends BaseFactory> = {
  [key in FontPropNames]?: MediableProperty<
    FontKeys<Fact['media'], Fact['fonts']>,
    Fact['media']
  >;
};

export type ThemeDnaProps<Fact extends BaseFactory> = ColorProps<Fact> &
  SpaceProps<Fact> &
  FontProps<Fact> &
  SelectorProps<Fact>;
