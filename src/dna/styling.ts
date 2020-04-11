import { ThemeObject, ThemeExtension, ThemeColor, Style, ThemeBorder, DNA } from "../theme/index.d"
import { InjectProperties } from "./index"

const style: Style<ThemeExtension> = {
    fg: "foreground",
    bg: "background",
    border: "ghost"
}

interface Border {
    width: number
    style: string
    color: string
}

/**
 * Converts keyed prop into array for breakpoints
 * @param theme
 * @param prop
 */
export const matchColorToTheme = <Theme extends ThemeObject<ThemeExtension>>({theme}: Theme, prop: ThemeColor<ThemeExtension>) => {
    if (!theme.colors) return []
    const colors = theme.colors[prop as ThemeColor<ThemeExtension>] || []
    // if color wasn't found, empty array to denote no colors
    if (!colors.length) return []
    // single color maps to array
    if (typeof(colors) == "string") return [colors]
    return colors
}

export const matchBorderToTheme = <T extends Style<ThemeExtension> & ThemeObject<ThemeExtension>>(props: T, prop: ThemeBorder<ThemeExtension>) => {
    const border = props.theme.borders[prop]
    // border is either a string, an object containing width, style, color, or array of objects denoting breakpoints
    if (!border) return []
    // if it's just a string, return an array with single value to denote border for all media queries
    if (typeof(border) == "string") return [border]
    if ((border as Border[])[0]) {
        // return a border string for each media query in the array if it's an array of objects
        return (border as (Border | string)[]).map((borderValue, i) => {
            if (typeof(borderValue == "string")) return props.theme.borders[borderValue as ThemeBorder<ThemeExtension>] || undefined
            const value = borderValue as Border
            const color = matchColorToTheme(props, value.color as ThemeColor<ThemeExtension>)
            if (!color.length) return ""
            // choose the current media query of i or the last index in color (whichever is smaller)
            const index = Math.min(i, color.length - 1)
            return `${value.width}px ${value.style} ${color[index]}}`
        }) as string[]
    }
    // when border is only an object
    const value = border as Border
    const color = matchColorToTheme(props, value.color as ThemeColor<ThemeExtension>)
    if (!color.length) return []

    // map colors so that border switches to right color for breakpoint
    return color.map(c => `${value.width}px ${value.style} ${c}`)
}

export const injectStyle: InjectProperties<Style<ThemeExtension>> = (props, defaultProps) => {
    const bg = (props.bg || defaultProps?.bg) && matchColorToTheme(props, (props.bg || defaultProps?.bg)!)
    const fg = (props.fg || defaultProps?.fg) && matchColorToTheme(props, (props.fg || defaultProps?.fg)!)
    const border = (props.border || defaultProps?.border) && matchBorderToTheme(props, (props.border || defaultProps?.border)!)
    return props.theme.breakpoints.map((_, i) => ({
        ...(bg && bg[i] && { "background-color": bg[i]}),
        ...(fg && fg[i] && { "color": fg[i]}),
        ...(border && border[i] && { "border": border[i]})
    }))
}

export const extractStyles = (props: DNA, keysToInclude?: (keyof Style<ThemeExtension>)[]) => {
    return Object.keys(props).filter(key => style[key as (keyof Style<ThemeExtension>)]).reduce((accum, key) => {
        const inArr = keysToInclude?.find(k => k == key)
        if (inArr || !keysToInclude) {
            accum[key] = (props as any)[key]
        }

        return accum;
    }, {} as any) as Partial<Style<ThemeExtension>>
}