import { injectSpace } from "./spacing";
import { injectStyle } from "./styling";
import { injectFonts } from "./fonts";
import { ThemeObject, ThemeExtension, DNA } from "../theme/index.d";

export const injectDNA = <T extends DNA & ThemeObject<ThemeExtension>>(props: T) => `
    ${injectSpace(props)}
    ${injectStyle(props)}
    ${injectFonts(props)}
`