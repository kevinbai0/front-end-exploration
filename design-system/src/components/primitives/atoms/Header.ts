import { injectDNA } from "../../../dna/index";
import { CrossPlatformFn } from "../../crossPlatform";

const Header: CrossPlatformFn = (props, platform) => `
    ${injectDNA(props, {
        fg: "foreground",
        m: "none",
        font: "header"
    })}
`

export default Header