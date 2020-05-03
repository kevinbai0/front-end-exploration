import { InitialTheme } from "./index"

export interface PrimitiveInjection {}
export interface Style<T> extends PrimitiveInjection {
    fg?: ThemeColor<T>
    bg?: ThemeColor<T>
    border?: ThemeBorder<T>
    radius?: number | ThemeBorderRadius<T>
    shadow?: ThemeShadow<T>
}

export interface Spacing<T> extends PrimitiveInjection {
    m?: number | number[] | ThemeSpace<T> | string | string[]
    p?: number | number[] | ThemeSpace<T> | string | string[]
    mx?: number | number[] | ThemeSpace<T> | string | string[]
    my?: number | number[] | ThemeSpace<T> | string | string[]
    px?: number | number[] | ThemeSpace<T> | string | string[]
    py?: number | number[] | ThemeSpace<T> | string | string[]
    mt?: number | number[] | ThemeSpace<T> | string | string[]
    mb?: number | number[] | ThemeSpace<T> | string | string[]
    ml?: number | number[] | ThemeSpace<T> | string | string[]
    mr?: number | number[] | ThemeSpace<T> | string | string[]
    pt?: number | number[] | ThemeSpace<T> | string | string[]
    pb?: number | number[] | ThemeSpace<T> | string | string[]
    pl?: number | number[] | ThemeSpace<T> | string | string[]
    pr?: number | number[] | ThemeSpace<T> | string | string[]
}

export interface Font<T> extends PrimitiveInjection {
    font?: ThemeFont<T>
}

export interface Layout<T> extends PrimitiveInjection {
    display?: ThemeLayout<T>
    rowLayout?: string
    colLayout?: string
    alignItems?: LayoutItems
    justifyItems?: LayoutItems
    alignContent?: LayoutContent
    justifyContent?: LayoutContent
    gap?: number | number[] | ThemeSpace<T> | string | string[]
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

export type DNA<T> = Spacing<T> & Style<T> & Font<T> & Layout<T> & Dimension & Position
export type DNATypes<T> = Spacing<T> | Style<T>| Font<T>

export interface ThemeExtension {}

//export type Theme<T> = InitialTheme & T
export type Theme<T> = InitialTheme & T
/*export type ThemeColor<T> = keyof Theme<T>["colors"]
export type ThemeSpace = keyof Theme<T>["space"]
export type ThemeFont<T> = keyof Theme<T>["fonts"]
export type ThemeFontFamily<T> = keyof Theme<T>["fontFamily"]
export type ThemeFontSize<T> = keyof Theme<T>["fontSizes"]
export type ThemeBorderRadius<T> = keyof Theme<T>["borderRadius"]
export type ThemeBorder<T> = keyof Theme<T>["borders"]*/

export type ThemeColor<T> = keyof Theme<T>["colors"]
export type ThemeSpace<T> = keyof Theme<T>["space"]
export type ThemeFont<T> = keyof Theme<T>["fonts"]
export type ThemeFontFamily<T> = keyof Theme<T>["fontFamily"]
export type ThemeFontSize<T> = keyof Theme<T>["fontSizes"]
export type ThemeBorderRadius<T> = keyof Theme<T>["borderRadius"]
export type ThemeBorder<T> = keyof Theme<T>["borders"]
export type ThemeLayout<T> = keyof Theme<T>["layout"]
export type ThemeShadow<T> = keyof Theme<T>["shadows"]

export type ThemeProperties<T> = ThemeColor<T> | ThemeSpace<T> | ThemeFont<T> | ThemeFontFamily<T> | ThemeFontSize<T> | ThemeBorderRadius<T> | ThemeBorder<T>

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;


export type ThemeObject<T> = {
    theme: Theme<T>
}

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme<ThemeExtension> {}
}