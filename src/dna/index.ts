import { Spacing, injectSpace } from "./spacing";
import { Style, injectStyle } from "./styling";
import { injectFonts } from "./fonts";
import { ThemeObject } from "../theme/types";
import { ThemeExtension } from "../theme/index";

export type DNA = Spacing & Style

export const injectDNA = <T extends DNA & ThemeObject<ThemeExtension>>(props: T) => `
    ${injectSpace(props)}
    ${injectStyle(props)}
    ${injectFonts(props)}
`