import { ThemeObject, Layout, DNA, ThemeLayout, LayoutContent, LayoutItems } from "../theme/types";
import { splitStyle } from "./helpers";
import { InjectProperties } from "./index";
import { matchSpaceToTheme } from "./spacing";
import { matchDimension } from "./dimensions";


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
        splitStyle("display", [], matchLayoutToTheme, props, defaultProps),
        splitStyle("position", ["position"], (_, prop: string) => [prop], props, defaultProps),
        splitStyle("left", ["left"], matchDimension, props, defaultProps),
        splitStyle("right", ["right"], matchDimension, props, defaultProps),
        splitStyle("top", ["top"], matchDimension, props, defaultProps),
        splitStyle("bottom", ["bottom"], matchDimension, props, defaultProps),
        splitStyle("rowLayout", ["grid-template-columns"], (_, prop: string) => [prop], props, defaultProps),
        splitStyle("colLayout", ["grid-template-rows"], (_, prop: string) => [prop], props, defaultProps),
        splitStyle("alignContent", ["align-content"], matchLayoutAlignment, props, defaultProps),
        splitStyle("justifyContent", ["justify-content"], matchLayoutAlignment, props, defaultProps),
        splitStyle("alignItems", ["align-items"], matchLayoutAlignment, props, defaultProps),
        splitStyle("justifyItems", ["justify-items"], matchLayoutAlignment, props, defaultProps),
        splitStyle("gap", ["grid-gap"], matchSpaceToTheme, props, defaultProps),
        splitStyle("justify", ["justify-self"], matchLayoutAlignment, props, defaultProps),
        splitStyle("align", ["align-self"], matchLayoutAlignment, props, defaultProps),
    ]
}