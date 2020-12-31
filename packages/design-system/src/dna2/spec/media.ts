import { StringKey } from '../types';
import { Size } from './types';

export type Media = Record<string, Size>;

export type ThemeSelectors = string[];
export type ThemeMedia = {
  breakpoints: Media;
  selectors: ThemeSelectors;
};

export type MediaIterable<Media extends ThemeMedia> =
  | StringKey<keyof Media['breakpoints']>
  | Media['selectors'][number];

export type MediaSelectorFn<Media extends ThemeMedia> = <T>() => MediaSelector<
  T,
  Media
>;
export type MediaSelector<T, Media extends ThemeMedia> = {
  [Key in MediaIterable<Media>]: (value: T) => [T, Key];
};

export type MediableProperty<T, Media extends ThemeMedia> =
  | T
  | (($: MediaSelector<T, Media>) => [T, ...[T, MediaIterable<Media>][]]);

export const createSelectors = <K extends string, T extends K[]>(
  ...values: T
) => {
  return values;
};

export const generateMedia = <Media extends ThemeMedia>(options: Media) => {
  return options;
};
