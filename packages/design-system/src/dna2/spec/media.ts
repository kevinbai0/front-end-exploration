import { StringKey } from '../types';
import { Size } from './types';

export type Media = Record<string, Size>;

export type ThemeSelectors = `$${string}`[];
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

export type MediaFn<T, Media extends ThemeMedia> = (
  val: T
) => MediaProperty<T, Media>;
export type MediableProperty<T, Media extends ThemeMedia> =
  | T
  | ((media: MediaFn<T, Media>) => MediaProperty<T, Media>);

export const createSelectors = <K extends `$${string}`, T extends K[]>(
  ...values: T
) => {
  return values;
};

export const generateMedia = <Media extends ThemeMedia>(options: Media) => {
  function mediaFn<T>(val: T) {
    return mediaHelper(val);
  }

  function mediaHelper<T>(
    val: T,
    key: MediaIterable<Media> | '_base' = '_base',
    saved: [MediaIterable<Media> | '_base', T][] = []
  ): MediaProperty<T, Media> {
    const newSaved = saved.concat([[key, val]]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: any = () => newSaved;
    [...Object.keys(options.breakpoints), ...options.selectors].forEach(
      (breakpoint) => {
        out[breakpoint as MediaIterable<Media>] = (value: T) =>
          mediaHelper(value, breakpoint as MediaIterable<Media>, newSaved);
      },
      out
    );

    return out as MediaProperty<T, Media>;
  }

  return { mediaFn, media: options };
};
