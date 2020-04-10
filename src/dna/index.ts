import { injectSpace } from "./spacing";
import { injectStyle } from "./styling";
import { injectFonts } from "./fonts";
import { DNA, ThemeObject, ThemeExtension } from "../theme/index.d";

export const injectDNA = <T extends DNA & ThemeObject<ThemeExtension>>(props: T) => `
    ${injectSpace(props)}
    ${injectStyle(props)}
    ${injectFonts(props)}
`