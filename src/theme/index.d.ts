import { InitialTheme } from "./index"

export interface PrimitiveInjection {}
export interface Style<T> extends PrimitiveInjection {
    fg?: ThemeColor<T>
    bg?: ThemeColor<T>
    border?: ThemeBorder<T>
}

export interface Spacing<T> extends PrimitiveInjection {
    m?: number | number[] | ThemeSpace<T>
    p?: number | number[] | ThemeSpace<T>
    mx?: number | number[] | ThemeSpace<T>
    my?: number | number[] | ThemeSpace<T>
    px?: number | number[] | ThemeSpace<T>
    py?: number | number[] | ThemeSpace<T>
    mt?: number | number[] | ThemeSpace<T>
    mb?: number | number[] | ThemeSpace<T>
    ml?: number | number[] | ThemeSpace<T>
    mr?: number | number[] | ThemeSpace<T>
    pt?: number | number[] | ThemeSpace<T>
    pb?: number | number[] | ThemeSpace<T>
    pl?: number | number[] | ThemeSpace<T>
    pr?: number | number[] | ThemeSpace<T>
}

export interface Font<T> extends PrimitiveInjection {
    font?: ThemeFont<T>
}

export interface FlexGridDisplayOptions extends PrimitiveInjection {
    align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"| "initial"| "inherit";
    justify?: "center" | "space-between" | "space-around" | "flex-start" | "flex-end" | "initial" | "inherit"
    rows?: string
    columns?: string
    gap?: number
    rowGap?: number
    columnGap?: number
}

export type DNA = Spacing<ThemeExtension> & Style<ThemeExtension> & Font<ThemeExtension>

export interface ThemeExtension {}

export type Theme<T> = InitialTheme & T

export type ThemeColor<T> = keyof Theme<T>["colors"]
export type ThemeSpace<T> = keyof Theme<T>["space"]
export type ThemeFont<T> = keyof Theme<T>["fonts"]
export type ThemeFontFamily<T> = keyof Theme<T>["fontFamily"]
export type ThemeFontSize<T> = keyof Theme<T>["fontSizes"]
export type ThemeBorderRadius<T> = keyof Theme<T>["borderRadius"]
export type ThemeBorder<T> = keyof Theme<T>["borders"]

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;


export type ThemeObject<T> = {
    theme: Theme<T>
}

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme<ThemeExtension> {}
}