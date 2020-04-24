import { injectDNA } from "../../../dna/index";
import { CrossPlatformFn } from "../../crossPlatform";

const Input: CrossPlatformFn = (props, platform) => `
    border: none;
    outline: none;
    border-bottom: 2px solid ${props.theme.colors["grey.2"]};

    ${platform == "react" ? `
        transition: all 0.2s ease;
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

export default Input