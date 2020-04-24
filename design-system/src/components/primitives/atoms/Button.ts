import { injectDNA } from "../../../dna/index";
import { CrossPlatformFn } from "../../crossPlatform";

const Button: CrossPlatformFn =  (props, platform) => `
    cursor: pointer;
    align-self: flex-start;
    outline: none;
    transition: opacity, transform 0.2s ease;
    ${platform == 'react' ? `
        :hover {
            opacity: 0.75;
            transform: scale(1.05);
        }

        :active {
            opacity: 0.5;
            transform: scale(1.07);
        }
    ` : ""}
    

    ${injectDNA(props, {
        bg: "action",
        fg: "background",
        font: "bigBody",
        px: "gap",
        py: "push",
        radius: "default",
        border: "none"
    }, platform)}
`

export default Button