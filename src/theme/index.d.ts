import { InitialTheme } from "./index"

export interface PrimitiveInjection {}
export interface Style extends PrimitiveInjection {
    fg?: ThemeColor
    bg?: ThemeColor
    border?: ThemeBorder
    radius?: number | ThemeBorderRadius
}

export interface Spacing extends PrimitiveInjection {
    m?: number | number[] | ThemeSpace
    p?: number | number[] | ThemeSpace
    mx?: number | number[] | ThemeSpace
    my?: number | number[] | ThemeSpace
    px?: number | number[] | ThemeSpace
    py?: number | number[] | ThemeSpace
    mt?: number | number[] | ThemeSpace
    mb?: number | number[] | ThemeSpace
    ml?: number | number[] | ThemeSpace
    mr?: number | number[] | ThemeSpace
    pt?: number | number[] | ThemeSpace
    pb?: number | number[] | ThemeSpace
    pl?: number | number[] | ThemeSpace
    pr?: number | number[] | ThemeSpace
}

export interface Font extends PrimitiveInjection {
    font?: ThemeFont
}

export interface Layout extends PrimitiveInjection {
    layout?: ThemeLayout
    alignItems?: LayoutItems
    justifyItems?: LayoutItems
    alignContent?: LayoutContent
    justifyContent?: LayoutContent
    gap?: number | number[] | ThemeSpace
}

export type LayoutContent = "start" | "end" | "center" | "stretch" | "space-around" | "space-between" | "space-evenly"
export type LayoutItems = "center" | "start" | "end" | "stretch"

export type DNA = Spacing & Style & Font & Layout
export type DNATypes = Spacing | Style | Font

export interface ThemeExtension {}

//export type Theme<T> = InitialTheme & T
export type Theme = InitialTheme
export type AppTheme<T> = InitialTheme & T
/*export type ThemeColor<T> = keyof Theme<T>["colors"]
export type ThemeSpace = keyof Theme<T>["space"]
export type ThemeFont<T> = keyof Theme<T>["fonts"]
export type ThemeFontFamily<T> = keyof Theme<T>["fontFamily"]
export type ThemeFontSize<T> = keyof Theme<T>["fontSizes"]
export type ThemeBorderRadius<T> = keyof Theme<T>["borderRadius"]
export type ThemeBorder<T> = keyof Theme<T>["borders"]*/

export type ThemeColor = keyof Theme["colors"]
export type ThemeSpace = keyof Theme["space"]
export type ThemeFont = keyof Theme["fonts"]
export type ThemeFontFamily = keyof Theme["fontFamily"]
export type ThemeFontSize = keyof Theme["fontSizes"]
export type ThemeBorderRadius = keyof Theme["borderRadius"]
export type ThemeBorder = keyof Theme["borders"]
export type ThemeLayout = keyof Theme["layout"]

export type ThemeProperties = ThemeColor | ThemeSpace | ThemeFont | ThemeFontFamily | ThemeFontSize | ThemeBorderRadius | ThemeBorder

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;


export type ThemeObject = {
    theme: Theme
}

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}