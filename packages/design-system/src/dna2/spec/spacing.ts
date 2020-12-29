import { ThemeMedia, MediableProperty } from './media';
import { Size } from './types';

type Multiplier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SpaceMultiplier = `${Multiplier}x`;
export type ThemeSpacing = Record<string, SpaceMultiplier>;

export const generateSpacing = <Media extends ThemeMedia>() => <
  Spacing extends ThemeSpacing
>(options: {
  baseMultiplier: MediableProperty<Size, Media>;
  aliases: Spacing;
}) => {
  return options;
};

export type SpaceKeys<T extends ThemeSpacing> = {
  [Key in keyof T]: Key extends string ? Key : never;
}[keyof T];
