import styled from "styled-components";
import { DNA, injectDNA } from "../dna/index";

export default styled.input<DNA>`
    font-size: 16px;
    padding: 10px 8px;
    background-color: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.greys[1]};
    border-radius: 3px;

    ${props => injectDNA(props)}
`