import { injectSpace } from "./spacing";
import { injectStyle } from "./styling";
import { injectFonts } from "./fonts";
import { DNA, ThemeObject, PrimitiveInjection } from "../theme/types";
import { injectLayout } from "./layout";
import { PlatformType } from "../components/crossPlatform";
import { injectDimensions } from "./dimensions";

export type InjectProperties<T> = (props: T & ThemeObject, defaultProps?: Partial<DNA>) => ({
    property: string[];
    value: string[];
} | undefined)[]

const injectStyles = (props: DNA & ThemeObject, defaultProps: Partial<DNA>, ...methods: InjectProperties<PrimitiveInjection>[]) => {
    return methods.map(method => {
        const styles = method(props, defaultProps)
        // for each breakpoint, return the right styles
        const reduced =  props.theme.breakpoints.map((_, i) => ({
            ...(styles.reduce((accum, style) => {
                if (style?.value[i]) {
                    if (typeof (style.property) == "string") accum[style.property] = style.value[i]
                    else style.property.map(property => (accum[property] = style.value[i]))
                    if (style.property.length == 0) {
                        style.value.map(val => val.trim().split(";").map(propGroup => {
                            if (!propGroup.length) return
                            const split = propGroup.split(":").map(val => val.trim())
                            if (split.length != 2) throw new Error("Invalid CSS for value of: " + val)
                            accum[split[0]] = split[1]
                        }))
                    }
                }
                return accum
            }, {} as {[key: string]: string}))
        }))

        return reduced.map((style, i) => {
            const entries = Object.entries(style)
            if (!entries.length) return ""
            if (i == 0) {
                return ` ${entries.map(entry => `${entry[0]}: ${entry[1]}; `).join("")}`
            }
            return `@media only screen and (min-width: ${props.theme.breakpoints[i]}px) {
                ${entries.map(entry => `${entry[0]}: ${entry[1]}; `).join("")}
            };`
        }).join("").replace(/^\s+|\s+$|\s+(?=\s)/g, "")
    }).join("")
}

export const injectDNA = (props: DNA & ThemeObject, defaultProps?: Partial<DNA>, platform?: PlatformType) => {
    const dna = `
        ${injectStyles(props, defaultProps || {}, injectSpace, injectStyle, injectFonts, injectLayout, injectDimensions)}
    `.replace(/^\s+|\s+$|\s+(?=\s)/g, "")
    return dna
}
