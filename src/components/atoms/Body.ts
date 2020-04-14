import { injectDNA } from "../../dna/index";
import { ThemeObject, DNA } from "../../theme/index.d";
import { PlatformType } from "../crossPlatform";

export default (props: DNA & ThemeObject, platform: PlatformType) => `
    font-weight: 400;
    margin: 0;

    ${injectDNA(props, {
        fg: "foreground",
        font: "body"
    }, platform)}
`