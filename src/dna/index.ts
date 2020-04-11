import { injectSpace } from "./spacing";
import { injectStyle } from "./styling";
import { injectFonts } from "./fonts";
import { DNA, ThemeObject, ThemeExtension } from "../theme/index.d";

const injectStyles = <T extends DNA & ThemeObject<ThemeExtension>>(...methods: ((props: T) => string)[]) => {
    
}

export const injectDNA = <T extends DNA & ThemeObject<ThemeExtension>>(props: T, defaultProps?: Partial<DNA>) => {
    const dna = `
        ${injectSpace(props)}
        ${injectFonts(props)}
        ${(() => {
            const styles = injectStyle(props, defaultProps)
            return styles.map((style, i) => {
                const entries = Object.entries(style)
                if (!entries.length) return ""
                if (i == 0) {
                    return `${entries.map(entry => `${entry[0]}: ${entry[1]};`)}`
                }
                return `@media only screen and (min-width: ${props.theme.breakpoints[i]}px) {
                    ${entries.map(entry => `${entry[0]}: ${entry[1]};`)}
                };`
            }).join("")
        })()}
    `.replace(/^\s+|\s+$|\s+(?=\s)/g, "")
    console.log(dna)
    return dna
}
