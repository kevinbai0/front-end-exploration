import { DNA, ThemeObject } from "../../theme/index.d";
import { injectDNA } from "../../dna/index";
import { PlatformType } from "../crossPlatform";

export default (props: DNA & ThemeObject, platform: PlatformType) => `
    ${injectDNA(props, {
        justifyContent: "center",
        alignContent: "center"
    })}
`