import { injectDNA } from "../../dna/index";
import { DNA, ThemeObject } from "../../theme/index.d";
import { PlatformType } from "../crossPlatform";

export default (props: DNA & ThemeObject, platform: PlatformType) => `
    ${injectDNA(props, {
        fg: "foreground",
        m: "none",
        font: "header"
    })}
`