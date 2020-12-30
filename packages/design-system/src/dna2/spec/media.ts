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

interface Out<T, Media extends ThemeMedia> {
  (): T;
  _values: MediaIterable<Media>;
}
type MediaBreakpoint<T, Media extends ThemeMedia> = {
  [key in MediaIterable<Media>]: (value: T) => MediaProperty<T, Media>;
};
export type MediaProperty<T, Media extends ThemeMedia> = Out<T, Media> &
  MediaBreakpoint<T, Media>;

export type MediaSelector<T, Media extends ThemeMedia> = {
  [Key in MediaIterable<Media>]: (value: T) => [T, Key];
};

export type MediaFn<T, Media extends ThemeMedia> = (
  val: T
) => MediaProperty<T, Media>;

export type MediableState = 'expanded' | 'default' | 'disabled';

export type MediableProperty<
  T,
  Media extends ThemeMedia,
  State extends MediableState = 'default'
> = State extends 'default'
  ? T | (($: MediaSelector<T, Media>) => [T, ...[T, MediaIterable<Media>][]])
  : State extends 'expanded'
  ? [T, MediaIterable<Media> | '_base'][]
  : never;

export const createSelectors = <K extends string, T extends K[]>(
  ...values: T
) => {
  return values;
};

export const generateMedia = <Media extends ThemeMedia>(options: Media) => {
  function mediaFn<T>() {
    return [...Object.keys(options.breakpoints), ...options.selectors].reduce<
      MediaSelector<T, Media>
    >((acc, breakpoint) => {
      return {
        ...acc,
        [breakpoint]: (val: T) => [val, breakpoint],
      };
    }, {} as MediaSelector<T, Media>);
  }

  return { mediaFn, media: options };
};
