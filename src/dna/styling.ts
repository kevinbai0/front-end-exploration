import { DNA } from "./index"
import { ThemeColor, ThemeBorder, ThemeExtension } from "../theme/index"
import { ThemeObject } from "../theme/types"

export interface Style {
    fg?: ThemeColor<ThemeExtension>
    bg?: ThemeColor<ThemeExtension>
    border?: ThemeBorder<ThemeExtension>
}

const style: Style = {
    fg: "foreground",
    bg: "background",
    border: "ghost"
}

const matchColorToTheme = <Theme extends ThemeObject<ThemeExtension>>({theme}: Theme, prop: ThemeColor<ThemeExtension>) => {
    if (!theme.colors) return prop
    const sections = prop.split(".")
    if (sections.length > 2) return prop
    const value = theme.colors[sections[0] as ThemeColor<ThemeExtension>]
    if (typeof(value) == "object") {
        const index = sections[1] && parseInt(sections[1])
        if (index && index != NaN) return value[index] || prop
        return prop
    }
    return value || prop
}

const matchBorder = <T extends Style & ThemeObject<ThemeExtension>>(props: T, prop: ThemeBorder<ThemeExtension>) => {
    const border = props.theme.borders[prop]
    return border.split(" ").map(item => props.theme.colors[item as ThemeColor<ThemeExtension>] || item).join(" ")
}

export const injectStyle = <T extends Style & ThemeObject<T["theme"]>>(props: T) => `
    ${props.bg && `background-color: ${matchColorToTheme(props, props.bg)}`};
    ${props.fg && `color: ${matchColorToTheme(props, props.fg)}`};
    ${props.border && `border: ${matchBorder(props, props.border)}`};
`

export const extractStyles = (props: DNA, keysToInclude?: (keyof Style)[]) => {
    return Object.keys(props).filter(key => style[key as (keyof Style)]).reduce((accum, key) => {
        const inArr = keysToInclude?.find(k => k == key)
        if (inArr || !keysToInclude) {
            accum[key] = (props as any)[key]
        }

        return accum;
    }, {} as any) as Partial<Style>
}