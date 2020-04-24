import { injectDNA } from "../../../dna/index";
import { CrossPlatformFn } from "../../crossPlatform";

const Box: CrossPlatformFn = (props, platform) => `
    ${injectDNA(props, {
        justifyContent: "center",
        alignContent: "center",
        position: "relative"
    }, platform)}
`;

export default Box