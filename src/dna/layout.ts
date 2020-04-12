import { ThemeObject, Layout, DNA, ThemeLayout, LayoutContent, LayoutItems } from "../theme/index.d";
import { splitStyle } from "./helpers";
import { InjectProperties } from "./index";
import { matchSpaceToTheme } from "./spacing";


export const matchLayoutToTheme = ({theme}: DNA & ThemeObject, prop: ThemeLayout) => {
    if (!theme.layout) return []
    const layout = (theme.layout[prop] || []) as string | string[]
    // if color wasn't found, empty array to denote no colors
    if (typeof(layout) == "string") return [layout]
    return layout
}

export const matchLayoutAlignment = (_: DNA & ThemeObject, prop: LayoutContent | LayoutItems) => [prop]


export const injectLayout: InjectProperties<Layout> = (props, defaultProps) => {
    return [
        splitStyle("layout", [], matchLayoutToTheme, props, defaultProps),
        splitStyle("alignContent", ["align-content"], matchLayoutAlignment, props, defaultProps),
        splitStyle("justifyContent", ["justify-content"], matchLayoutAlignment, props, defaultProps),
        splitStyle("alignItems", ["align-items"], matchLayoutAlignment, props, defaultProps),
        splitStyle("justifyItems", ["justify-items"], matchLayoutAlignment, props, defaultProps),
        splitStyle("gap", ["grid-gap"], matchSpaceToTheme, props, defaultProps)
    ]
}