import { AppBps, MediableProperty } from './media';
import { Size } from './types';

type Multiplier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SpaceMultiplier = `${Multiplier}x`;

export const generateSpacing = <Bps extends AppBps>() => <
  Aliases extends Record<string, SpaceMultiplier>
>(options: {
  baseMultiplier: MediableProperty<Size, Bps>;
  aliases: Aliases;
}) => {
  return options;
};

export type SpaceKeys<T extends Record<string, SpaceMultiplier>> = {
  [Key in keyof T]: Key extends string ? Key : never;
}[keyof T];
