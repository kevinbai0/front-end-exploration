import { injectSpace } from "./spacing";
import { injectStyle } from "./styling";
import { injectFonts } from "./fonts";
import { DNA, ThemeObject, ThemeExtension, PrimitiveInjection } from "../theme/index.d";

export type InjectProperties<T extends PrimitiveInjection> = (props: T & ThemeObject<ThemeExtension>, defaultProps?: Partial<DNA>) => { [key: string]: string }[]

const injectStyles = (props: DNA & ThemeObject<ThemeExtension>, defaultProps: Partial<DNA>, ...methods: InjectProperties<PrimitiveInjection>[]) => {
    return methods.map(method => {
        const styles = method(props, defaultProps)
        return styles.map((style, i) => {
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

export const injectDNA = (props: DNA & ThemeObject<ThemeExtension>, defaultProps?: Partial<DNA>) => {
    const dna = `
        ${injectStyles(props, defaultProps || {}, injectSpace, injectStyle, injectFonts)}
    `.replace(/^\s+|\s+$|\s+(?=\s)/g, "")
    return dna
}
