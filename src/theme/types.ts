import { InitialTheme } from "./index"

export interface PrimitiveInjection {}
export interface Style extends PrimitiveInjection {
    fg?: ThemeColor
    bg?: ThemeColor
    border?: ThemeBorder
    radius?: number | ThemeBorderRadius
    shadow?: ThemeShadow
}

export interface Spacing extends PrimitiveInjection {
    m?: number | number[] | ThemeSpace | string | string[]
    p?: number | number[] | ThemeSpace | string | string[]
    mx?: number | number[] | ThemeSpace | string | string[]
    my?: number | number[] | ThemeSpace | string | string[]
    px?: number | number[] | ThemeSpace | string | string[]
    py?: number | number[] | ThemeSpace | string | string[]
    mt?: number | number[] | ThemeSpace | string | string[]
    mb?: number | number[] | ThemeSpace | string | string[]
    ml?: number | number[] | ThemeSpace | string | string[]
    mr?: number | number[] | ThemeSpace | string | string[]
    pt?: number | number[] | ThemeSpace | string | string[]
    pb?: number | number[] | ThemeSpace | string | string[]
    pl?: number | number[] | ThemeSpace | string | string[]
    pr?: number | number[] | ThemeSpace | string | string[]
}

export interface Font extends PrimitiveInjection {
    font?: ThemeFont
}

export interface Layout extends PrimitiveInjection {
    display?: ThemeLayout
    rowLayout?: string
    colLayout?: string
    alignItems?: LayoutItems
    justifyItems?: LayoutItems
    alignContent?: LayoutContent
    justifyContent?: LayoutContent
    gap?: number | number[] | ThemeSpace | string | string[]
    align?: LayoutItems
    justify?: LayoutItems
}

export interface Position extends PrimitiveInjection {
    position?: "absolute" | "relative" | ("absolute" | "relative")[],
    left?: number | string | (number | string)[],
    right?: number | string | (number | string)[],
    top?: number | string | (number | string)[],
    bottom?: number | string | (number | string)[],
}

export interface Dimension extends PrimitiveInjection {
    width?: number | string | (number | string)[]
    height?: number | string | (number | string)[]
    maxWidth?: number | string | (number | string)[]
    maxHeight?: number | string | (number | string)[]
    minWidth?: number | string | (number | string)[]
    minHeight?: number | string | (number | string)[]
}

export type LayoutContent = "start" | "end" | "center" | "stretch" | "space-around" | "space-between" | "space-evenly"
export type LayoutItems = "center" | "start" | "end" | "stretch"

export type DNA = Spacing & Style & Font & Layout & Dimension & Position
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
export type ThemeShadow = keyof Theme["shadows"]

export type ThemeProperties = ThemeColor | ThemeSpace | ThemeFont | ThemeFontFamily | ThemeFontSize | ThemeBorderRadius | ThemeBorder

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;


export type ThemeObject = {
    theme: Theme
}

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}