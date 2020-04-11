import { InitialTheme } from "./index"
export interface Style {
    fg?: ThemeColor<ThemeExtension>
    bg?: ThemeColor<ThemeExtension>
    border?: ThemeBorder<ThemeExtension>
}

export interface Spacing {
    m?: number,
    p?: number
    mx?: number
    my?: number
    px?: number
    py?: number
    mt?: number
    mb?: number
    ml?: number
    mr?: number
    pt?: number
    pb?: number
    pl?: number
    pr?: number
}

export interface Font<T> {
    font?: ThemeFont<T>
}

export interface FlexGridDisplayOptions {
    align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"| "initial"| "inherit";
    justify?: "center" | "space-between" | "space-around" | "flex-start" | "flex-end" | "initial" | "inherit"
    rows?: string
    columns?: string
    gap?: number
    rowGap?: number
    columnGap?: number
}

export type DNA = Spacing & Style & Font<ThemeExtension>

export interface ThemeExtension {}

export type Theme<T> = InitialTheme & T

export type ThemeColor<T> = keyof Theme<T>["colors"]
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