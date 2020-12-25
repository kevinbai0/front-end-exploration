interface Out<T, Breakpoints extends Record<string, unknown>> {
  (): T;
  _values: keyof Breakpoints;
}

type MediaBreakpoint<T, Breakpoints extends Record<string, unknown>> = {
  [key in keyof Breakpoints]: (value: T) => MediaProperty<T, Breakpoints>;
}

export type MediaProperty<T, Breakpoints extends Record<string, unknown>> = Out<T, Breakpoints> & MediaBreakpoint<T, Breakpoints>

export const generateMedia = <Breakpoints extends Record<string, unknown>>(breakpoints: Breakpoints) => {
  function media<T>(val: T)  {
    return mediaHelper(val);
  }

  function mediaHelper<T>(val: T, key: keyof Breakpoints | '_base' = '_base', saved: { [key in keyof Breakpoints | '_base']?: T } = {}): MediaProperty<T, Breakpoints> {
    const newSaved = {
      ...saved,
      [key]: val
    }
    const out: any = () => newSaved;
    Object.keys(breakpoints).forEach((breakpoint) => {
      out[breakpoint as keyof Breakpoints] = (value: T) => mediaHelper(value, breakpoint as keyof Breakpoints, newSaved);
    }, out);

    return out as MediaProperty<T, Breakpoints>;
  }

  return { media };
}

