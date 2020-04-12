import styled from "styled-components";
import { injectDNA } from "../dna/index";
import { DNA } from "../theme/index.d";

export default styled.button<DNA>`
    cursor: pointer;
    align-self: flex-start;
    outline: none;
    transition: opacity, transform 0.2s ease;
    :hover {
        opacity: 0.75;
        transform: scale(1.05);
    }

    :active {
        opacity: 0.5;
        transform: scale(1.07);
    }

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