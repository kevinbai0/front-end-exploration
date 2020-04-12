import styled from "styled-components";
import { injectDNA } from "../dna/index";
import { DNA } from "../theme/index.d";

export default styled.button<DNA>`
    cursor: pointer;
    align-self: flex-start;

    ${props => injectDNA(props, {
        bg: "action",
        fg: "background",
        font: "bigBody",
        px: "gap",
        py: "push",
        radius: "default",
        border: "none"
    })}
`