import { injectDNA } from "../../dna/index"
import { CrossPlatformFn } from "../crossPlatform"

const Card: CrossPlatformFn = (props, platform) => `
    ${injectDNA(props, {
        bg: "grey.1",
        radius: "small",
        p: "breathe",
        shadow: "default"
    }, platform)}
`

export default Card