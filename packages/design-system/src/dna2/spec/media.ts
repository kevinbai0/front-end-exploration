import { Size } from './types';

export type AppBps = Record<string, Size>;

interface Out<T, Bps extends AppBps> {
  (): T;
  _values: keyof Bps;
}
type MediaBreakpoint<T, Bps extends AppBps> = {
  [key in keyof Bps]: (value: T) => MediaProperty<T, Bps>;
};
export type MediaProperty<T, Bps extends AppBps> = Out<T, Bps> &
  MediaBreakpoint<T, Bps>;

export type MediaFn<T, Bps extends AppBps> = (val: T) => MediaProperty<T, Bps>;
export type MediableProperty<T, Bps extends AppBps> =
  | T
  | ((media: MediaFn<T, Bps>) => MediaProperty<T, Bps>);

export const generateMedia = <Bps extends AppBps>(breakpoints: Bps) => {
  function media<T>(val: T) {
    return mediaHelper(val);
  }

  function mediaHelper<T>(
    val: T,
    key: keyof Bps | '_base' = '_base',
    saved: { [key in keyof Bps | '_base']?: T } = {}
  ): MediaProperty<T, Bps> {
    const newSaved = {
      ...saved,
      [key]: val,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: any = () => newSaved;
    Object.keys(breakpoints).forEach((breakpoint) => {
      out[breakpoint as keyof Bps] = (value: T) =>
        mediaHelper(value, breakpoint as keyof Bps, newSaved);
    }, out);

    return out as MediaProperty<T, Bps>;
  }

  return { media, breakpoints };
};
