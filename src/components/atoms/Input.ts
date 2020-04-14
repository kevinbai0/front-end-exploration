import { DNA, ThemeObject } from "../../theme/index.d";
import { injectDNA } from "../../dna/index";
import { PlatformType } from "../crossPlatform";

export default (props: DNA & ThemeObject, platform: PlatformType) => `
    border: none;
    outline: none;
    border-bottom: 2px solid ${props.theme.colors["grey.2"]};

    transition: all 0.2s ease;
    ${platform == "react" ? `
        :focus {
            border-bottom: 2px solid ${props.theme.colors.primary};
        }
    ` : ""}

    ${injectDNA(props, {
        bg: "background",
        font: "bigBody",
        py: "shift"
    }, platform)}
`