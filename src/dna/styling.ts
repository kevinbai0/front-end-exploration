import { ThemeColor, Style, ThemeBorder, ThemeObject, DNA, ThemeBorderRadius, ThemeShadow } from "../theme/types"
import { InjectProperties } from "./index"
import { splitStyle } from "./helpers"

const style: Style = {
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
export const matchColorToTheme = ({theme}: DNA & ThemeObject, prop: ThemeColor) => {
    if (!theme.colors) return []
    const colors = theme.colors[prop as ThemeColor] || []
    // if color wasn't found, empty array to denote no colors
    if (!colors.length) return []
    // single color maps to array
    if (typeof(colors) == "string") return [colors]
    return colors
}

export const matchBorderToTheme = (props: DNA & ThemeObject, prop: ThemeBorder) => {
    const border = props.theme.borders[prop]
    // border is either a string, an object containing width, style, color, or array of objects denoting breakpoints
    if (!border) return []
    // if it's just a string, return an array with single value to denote border for all media queries
    if (typeof(border) == "string") return [border]
    if ((border as Border[])[0]) {
        // return a border string for each media query in the array if it's an array of objects
        return (border as (Border | string)[]).map((borderValue, i) => {
            if (typeof(borderValue == "string")) return props.theme.borders[borderValue as ThemeBorder] || undefined
            const value = borderValue as Border
            const color = matchColorToTheme(props, value.color as ThemeColor)
            if (!color.length) return ""
            // choose the current media query of i or the last index in color (whichever is smaller)
            const index = Math.min(i, color.length - 1)
            return `${value.width}px ${value.style} ${color[index]}}`
        }) as string[]
    }
    // when border is only an object
    const value = border as Border
    const color = matchColorToTheme(props, value.color as ThemeColor)
    if (!color.length) return []

    // map colors so that border switches to right color for breakpoint
    return color.map(c => `${value.width}px ${value.style} ${c}`)
}

export const matchBorderRadiusToTheme = ({theme}: DNA & ThemeObject, prop: ThemeBorderRadius) => {
    const radius = (theme.borderRadius[prop] ?? []) as number | number[]
    if (!(radius as number[]).length) return [radius + "px"]
    if (typeof(radius) == "number") return [radius + "px"]
    return radius.map((rad: number) => rad + "px")
}

export const matchShadowToTheme = ({theme}: DNA & ThemeObject, prop: ThemeShadow) => {
    const shadow = (theme.shadows[prop] ?? []) as string | string[]
    if (!(shadow as string[]).length) return []
    return [shadow as string]
}

export const injectStyle: InjectProperties<Style> = (props, defaultProps) => {
    return [
        splitStyle("bg", ["background-color"], matchColorToTheme, props, defaultProps),
        splitStyle("fg", ["color"], matchColorToTheme, props, defaultProps),
        splitStyle("border", ["border"], matchBorderToTheme, props, defaultProps),
        splitStyle("radius", ["border-radius"], matchBorderRadiusToTheme, props, defaultProps),
        splitStyle("shadow", ["box-shadow"], matchShadowToTheme, props, defaultProps)
    ]
}

// not userful right now but maybe in the future
/*export const extractStyles = (props: DNA, keysToInclude?: (keyof Style)[]) => {
    return Object.keys(props).filter(key => style[key as (keyof Style)]).reduce((accum, key) => {
        const inArr = keysToInclude?.find(k => k == key)
        if (inArr || !keysToInclude) {
            accum[key] = (props as any)[key]
        }

        return accum;
    }, {} as any) as Partial<Style>
}
*/