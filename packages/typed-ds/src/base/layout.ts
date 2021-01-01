import { StringKey } from '../types';
import { BaseFactory } from './factory';
import { ThemeMedia, MediableProperty } from './media';

type DisplayPrimitive = 'row' | 'column';
type AlignPrimitive = 'flex-start' | 'flex-end' | 'center' | 'stretch';
type JustifyPrimitive = 'space-between' | 'space-evenly';

export type ThemeLayoutProperties<
  Media extends ThemeMedia,
  Mediable extends boolean = false
> = {
  display: Record<
    string,
    Mediable extends true
      ? MediableProperty<DisplayPrimitive, Media>
      : DisplayPrimitive
  >;
  align: Record<
    string,
    Mediable extends true
      ? MediableProperty<AlignPrimitive, Media>
      : AlignPrimitive
  >;
  justify: Record<
    string,
    Mediable extends true
      ? MediableProperty<JustifyPrimitive, Media>
      : JustifyPrimitive
  >;
};

export type ThemeLayoutAliases<Media extends ThemeMedia> = Record<
  string,
  ThemeLayoutProperties<Media, true>
>;

export type ThemeLayout<
  Media extends ThemeMedia,
  Props extends ThemeLayoutProperties<Media>,
  Aliases extends ThemeLayoutAliases<Media>
> = {
  properties: Props;
  aliases: Aliases;
};

export const generate = <Media extends ThemeMedia>() => <
  Props extends ThemeLayoutProperties<Media>,
  Aliases extends ThemeLayoutAliases<Media>,
  Options extends ThemeLayout<Media, Props, Aliases>
>(
  options: Options
): Options => {
  const { properties, aliases } = options;
  return {
    properties,
    aliases,
  } as Options;
};

type LayoutShortform<
  Media extends ThemeMedia,
  Props extends BaseFactory<Media>['layout']['properties']
> =
  | `${StringKey<keyof Props['display']>}:${StringKey<keyof Props['align']>}`
  | `${StringKey<keyof Props['display']>}:${StringKey<
      keyof Props['align']
    >}:${StringKey<keyof Props['justify']>}`;

export type LayoutKeys<
  Media extends ThemeMedia,
  Fact extends BaseFactory<Media>
> =
  | keyof Fact['layout']['aliases']
  | LayoutShortform<Media, Fact['layout']['properties']>;
