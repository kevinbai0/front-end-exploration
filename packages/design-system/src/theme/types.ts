import { InitialTheme } from './index';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PrimitiveInjection {}
export interface Style<T> extends PrimitiveInjection {
  fg?: ThemeColor<T> | undefined;
  bg?: ThemeColor<T> | undefined;
  border?: ThemeBorder<T> | undefined;
  radius?: number | ThemeBorderRadius<T> | undefined;
  shadow?: ThemeShadow<T> | undefined;
  opacity?: number | undefined;
}

export interface Spacing<T = ThemeExtension> extends PrimitiveInjection {
  m?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  p?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  mx?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  my?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  px?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  py?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  mt?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  mb?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  ml?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  mr?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  pt?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  pb?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  pl?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  pr?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
}

export interface Font<T> extends PrimitiveInjection {
  font?: ThemeFont<T> | undefined;
  weight?: 400 | 500 | 600 | 700 | undefined;
}

export interface Layout<T = ThemeExtension> extends PrimitiveInjection {
  display?: ThemeLayout<T> | ThemeLayout<T>[] | undefined;
  rowLayout?: string | undefined;
  colLayout?: string | undefined;
  alignItems?: LayoutItems | undefined;
  justifyItems?: LayoutItems | undefined;
  alignContent?: LayoutContent | undefined;
  justifyContent?: LayoutContent | undefined;
  gap?: number | number[] | ThemeSpace<T> | string | string[] | undefined;
  align?: LayoutItems | undefined;
  justify?: LayoutItems | undefined;
  flex?: number | undefined;
}

export interface Position extends PrimitiveInjection {
  position?:
    | 'absolute'
    | 'relative'
    | 'sticky'
    | ('absolute' | 'relative' | 'sticky')[]
    | undefined;
  left?: number | string | (number | string)[] | undefined;
  right?: number | string | (number | string)[] | undefined;
  top?: number | string | (number | string)[] | undefined;
  bottom?: number | string | (number | string)[] | undefined;
}

export interface Dimension extends PrimitiveInjection {
  width?: number | string | (number | string)[] | undefined;
  height?: number | string | (number | string)[] | undefined;
  maxWidth?: number | string | (number | string)[] | undefined;
  maxHeight?: number | string | (number | string)[] | undefined;
  minWidth?: number | string | (number | string)[] | undefined;
  minHeight?: number | string | (number | string)[] | undefined;
}

export type LayoutContent =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | 'flex-start'
  | 'flex-end';

export type LayoutItems =
  | 'center'
  | 'start'
  | 'end'
  | 'stretch'
  | 'flex-start'
  | 'flex-end'
  | 'baseline';

export type DNA<T = Theme> = Spacing<T> &
  Style<T> &
  Font<T> &
  Layout<T> &
  Dimension &
  Position;
export type DNATypes<T = ThemeExtension> = Spacing<T> | Style<T> | Font<T>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThemeExtension {}

export type Theme<T = ThemeExtension> = InitialTheme & T;

export type ThemeColor<T = ThemeExtension> = keyof Theme<T>['colors'];
export type ThemeSpace<T = ThemeExtension> = keyof Theme<T>['space'];
export type ThemeFont<T = ThemeExtension> = keyof Theme<T>['fonts'];
export type ThemeFontFamily<T = ThemeExtension> = keyof Theme<T>['fontFamily'];
export type ThemeFontSize<T = ThemeExtension> = keyof Theme<T>['fontSizes'];
export type ThemeBorderRadius<
  T = ThemeExtension
> = keyof Theme<T>['borderRadius'];
export type ThemeBorder<T = ThemeExtension> = keyof Theme<T>['borders'];
export type ThemeLayout<T = ThemeExtension> = keyof Theme<T>['layout'];
export type ThemeShadow<T = ThemeExtension> = keyof Theme<T>['shadows'];

export type ThemeProperties<T = ThemeExtension> =
  | ThemeColor<T>
  | ThemeSpace<T>
  | ThemeFont<T>
  | ThemeFontFamily<T>
  | ThemeFontSize<T>
  | ThemeBorderRadius<T>
  | ThemeBorder<T>;

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;

export type ThemeObject<T = ThemeExtension> = {
  theme: Theme<T>;
};

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme<ThemeExtension> {}
}
