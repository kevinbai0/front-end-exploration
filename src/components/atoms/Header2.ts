import { injectDNA } from "../../dna/index";
import { CrossPlatformFn } from "../crossPlatform";

const Header2: CrossPlatformFn = (props, platform) => `
    ${injectDNA(props, {
        fg: "foreground",
        m: "none",
        font: "header2"
    })}
`

export default Header2