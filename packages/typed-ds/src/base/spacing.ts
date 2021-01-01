import { Size } from './types';

type Multiplier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SpaceMultiplier = `${Multiplier}x`;
export type ThemeSpacing = {
  baseMultiplier: Size;
  aliases: Record<string, SpaceMultiplier>;
};

export const generate = <Space extends ThemeSpacing>(options: Space) => {
  return options;
};

export type SpaceKeys<T extends ThemeSpacing> = {
  [Key in keyof T['aliases']]: Key extends string ? Key : never;
}[keyof T['aliases']];
