const globalBreakpoints = {
  tablet: 768,
  desktop: 1024,
  xLarge: 1440
} as const;

interface Out<T, Breakpoints extends Record<string, unknown>> {
  (): T;
  _values: keyof Breakpoints;
}

type MediaBreakpoint<T, Breakpoints extends Record<string, unknown>> = {
  [key in keyof Breakpoints]: (value: T) => Func<T, Breakpoints>;
}

type Func<T, Breakpoints extends Record<string, unknown>> = Out<T, Breakpoints> & MediaBreakpoint<T, Breakpoints>


const generateMedia = <Breakpoints extends Record<string, unknown>>(breakpoints: Breakpoints) => {
  function media<T>(val: T)  {
    return mediaHelper(val);
  }

  function mediaHelper<T>(val: T, key: keyof Breakpoints | '_base' = '_base', saved: { [key in keyof Breakpoints | '_base']?: T } = {}): Func<T, Breakpoints> {
    const newSaved = {
      ...saved,
      [key]: val
    }
    const out: any = () => newSaved;
    Object.keys(breakpoints).forEach((breakpoint) => {
      out[breakpoint as keyof Breakpoints] = (value: T) => mediaHelper(value, breakpoint as keyof Breakpoints, newSaved);
    }, out);

    return out as Func<T, Breakpoints>;
  }

  return { media };
}


const { media } = generateMedia(globalBreakpoints);

console.log(media(2).tablet(10).desktop(100))