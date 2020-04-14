import { injectDNA } from "../../dna/index";
import { CrossPlatformFn } from "../crossPlatform";

const Body: CrossPlatformFn =  (props, platform) => `
    font-weight: 400;
    margin: 0;

    ${injectDNA(props, {
        fg: "foreground",
        font: "body"
    }, platform)}
`

export default Body