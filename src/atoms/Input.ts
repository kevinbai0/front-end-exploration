import styled from "styled-components";
import { DNA } from "../theme/index.d";
import { injectDNA } from "../dna/index";

export default styled.input<DNA>`
    border: none;
    outline: none;
    border-bottom: 2px solid ${props => props.theme.colors["grey.2"]};

    transition: all 0.2s ease;
    :focus {
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }

    ${props => injectDNA(props, {
        bg: "background",
        font: "bigBody",
        py: "shift"
    })}
`