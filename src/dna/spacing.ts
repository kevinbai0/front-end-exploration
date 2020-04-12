import { Spacing, ThemeObject, ThemeExtension, ThemeSpace, DNA } from "../theme/index.d";
import { InjectProperties } from "./index";
import { splitStyle, MatchFunction } from "./helpers";

export const matchSpaceToTheme = (props: DNA & ThemeObject, space: number | number[] | ThemeSpace | ThemeSpace[] | string | string[]) => {
    if (typeof(space) == "number") return [space + "px"]
    if (typeof(space) == "string") {
        const themeSpace = (props.theme.space[space as ThemeSpace] ?? [space]) as (number | (number | string)[])
        if (typeof(themeSpace) == "number") return [themeSpace + "px"]
        return themeSpace.map((value) => typeof(value) == "string" ? value : value + "px")
    }
    if (space.length == 0) return []
    if (typeof(space[0]) == "number") {
        return (space as number[]).map(value => value + "px")
    }

    if (typeof(space[0]) == "string" && props.theme.space[space[0] as ThemeSpace] == undefined) {
        return (space as string[]).map(value => value)
    }
    // add up the spacing
    const expansion = (space as ThemeSpace[]).map(value => {
        const themeSpace = props.theme.space[value] ?? props.theme.breakpoints.map(() => 0)
        if (typeof(themeSpace) == "number") return props.theme.breakpoints.map(() => themeSpace)
        let returnArr: number[] = []
        let lastGood = themeSpace[0] ?? 0
        props.theme.breakpoints.forEach((_, i) => {
            returnArr.push(themeSpace[i] ?? lastGood)
            if (themeSpace[i] != undefined) lastGood = themeSpace[i]
        })
        return returnArr
    })

    // expansion is an n x n array. We want to sum the columns now
    // this only works since it's nxn, we just use map as an iterator
    let col = 0
    return expansion.map((_, i) => {
        let sum = 0
        for (let row = 0; row < expansion.length; ++row) sum += expansion[col][i]
        return sum + "px"
    })
}

export const injectSpace: InjectProperties<Spacing>  = (props, defaultProps) => {
    return [
        splitStyle("m", ["margin"], matchSpaceToTheme, props, defaultProps),
        splitStyle("p", ["padding"], matchSpaceToTheme, props, defaultProps),
        splitStyle("mx", ["margin-left", "margin-right"], matchSpaceToTheme, props, defaultProps),
        splitStyle("my", ["margin-top", "margin-bottom"], matchSpaceToTheme, props, defaultProps),
        splitStyle("px", ["padding-left", "padding-right"], matchSpaceToTheme, props, defaultProps),
        splitStyle("py", ["padding-top", "padding-bottom"], matchSpaceToTheme, props, defaultProps),
        splitStyle("ml", ["margin-left"], matchSpaceToTheme, props, defaultProps),
        splitStyle("mr", ["margin-right"], matchSpaceToTheme, props, defaultProps),
        splitStyle("mt", ["margin-top"], matchSpaceToTheme, props, defaultProps),
        splitStyle("mb", ["margin-bottom"], matchSpaceToTheme, props, defaultProps),
        splitStyle("pl", ["padding-left"], matchSpaceToTheme, props, defaultProps),
        splitStyle("pr", ["padding-right"], matchSpaceToTheme, props, defaultProps),
        splitStyle("pt", ["padding-top"], matchSpaceToTheme, props, defaultProps),
        splitStyle("pb", ["padding-bottom"], matchSpaceToTheme, props, defaultProps),
    ]
}