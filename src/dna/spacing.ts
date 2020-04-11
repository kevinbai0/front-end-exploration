import { Spacing, ThemeObject, ThemeExtension, ThemeSpace, DNA } from "../theme/index.d";
import { InjectProperties } from "./index";

const matchSpaceToTheme =  <Theme extends ThemeObject<ThemeExtension>>(props: Theme, space: number | number[] | ThemeSpace<ThemeExtension> | ThemeSpace<ThemeExtension>[]) => {
    if (typeof(space) == "number") return [space]
    if (typeof(space) == "string") {
        const themeSpace = props.theme.space[space as ThemeSpace<ThemeExtension>] ?? []
        if (typeof(themeSpace) == "number") return [themeSpace]
        return themeSpace
    }
    if (space.length == 0) return []
    if (typeof(space[0]) == "number") {
        return space as number[]
    }
    // add up the spacing
    const expansion = (space as ThemeSpace<ThemeExtension>[]).map(value => {
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
        return sum
    })
}

export const injectSpace: InjectProperties<Spacing<ThemeExtension>>  = (props, defaultProps) => {
    const m = (props.m ?? defaultProps?.m) != undefined && matchSpaceToTheme(props, (props.m || defaultProps?.m)!)
    const p = (props.p ?? defaultProps?.p) != undefined && matchSpaceToTheme(props, (props.p || defaultProps?.p)!)

    const mx = (props.mx ?? defaultProps?.mx) != undefined && matchSpaceToTheme(props, (props.mx || defaultProps?.mx)!)
    const my = (props.my ?? defaultProps?.my) != undefined && matchSpaceToTheme(props, (props.my || defaultProps?.my)!)
    const px = (props.px ?? defaultProps?.px) != undefined && matchSpaceToTheme(props, (props.px || defaultProps?.px)!)
    const py = (props.py ?? defaultProps?.py) != undefined && matchSpaceToTheme(props, (props.py || defaultProps?.py)!)
    
    const ml = (props.ml ?? defaultProps?.ml) != undefined && matchSpaceToTheme(props, (props.ml || defaultProps?.ml)!)
    const mr = (props.mr ?? defaultProps?.mr) != undefined && matchSpaceToTheme(props, (props.mr || defaultProps?.mr)!)
    const mt = (props.mt ?? defaultProps?.mt) != undefined && matchSpaceToTheme(props, (props.mt || defaultProps?.mt)!)
    const mb = (props.mb ?? defaultProps?.mb) != undefined && matchSpaceToTheme(props, (props.mb || defaultProps?.mb)!)

    const pl = (props.pl ?? defaultProps?.pl) != undefined && matchSpaceToTheme(props, (props.pl || defaultProps?.pl)!)
    const pr = (props.pr ?? defaultProps?.pr) != undefined && matchSpaceToTheme(props, (props.pr || defaultProps?.pr)!)
    const pt = (props.pt ?? defaultProps?.pt) != undefined && matchSpaceToTheme(props, (props.pt || defaultProps?.pt)!)
    const pb = (props.pb ?? defaultProps?.pb) != undefined && matchSpaceToTheme(props, (props.pb || defaultProps?.pb)!)

    return props.theme.breakpoints.map((_, i) => ({
        ...(m && m[i] != undefined && { margin: `${m[i]}px`}),
        ...(p && p[i] != undefined && { padding: `${p[i]}px`}),
        ...(mx && mx[i] != undefined && { "margin-left": `${mx[i]}px`, "margin-right": `${mx[i]}px` }),
        ...(my && my[i] != undefined && { "margin-top": `${my[i]}px`, "margin-bottom": `${my[i]}px` }),
        ...(px && px[i] != undefined && { "padding-left": `${px[i]}px`, "padding-right": `${px[i]}px` }),
        ...(py && py[i] != undefined && { "padding-top": `${py[i]}px`, "padding-bottom": `${py[i]}px` }),
        ...(ml && ml[i] != undefined && { "margin-left": `${ml[i]}px` }),
        ...(mr && mr[i] != undefined && { "margin-right": `${mr[i]}px` }),
        ...(mt && mt[i] != undefined && { "margin-top": `${mt[i]}px` }),
        ...(mb && mb[i] != undefined && { "margin-bottom": `${mb[i]}px` }),
        ...(pl && pl[i] != undefined && { "padding-left": `${pl[i]}px` }),
        ...(pr && pr[i] != undefined && { "padding-right": `${pr[i]}px` }),
        ...(pt && pt[i] != undefined && { "padding-top": `${pt[i]}px` }),
        ...(pb && pb[i] != undefined && { "padding-bottom": `${pb[i]}px` }),
    }))
}