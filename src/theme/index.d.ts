import { InitialTheme } from "./index"

export interface Style {
    fg?: ThemeColor<ThemeExtension>
    bg?: ThemeColor<ThemeExtension>
    border?: ThemeBorder<ThemeExtension>
}


export interface Spacing {
    m?: string,
    p?: string
    mt?: number
    mb?: number
    ml?: number
    mr?: number
    pt?: number
    pb?: number
    pl?: number
    pr?: number
}

export type DNA = Spacing & Style

export interface ThemeExtension {
    
}

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