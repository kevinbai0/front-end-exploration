import styled from "styled-components";
import { DNA, injectDNA } from "../dna/index";

export default styled.p<DNA>`
    color: ${props => props.theme.colors.foreground};
    font-size: ${props => props.theme.fontSizes.body}px;
    font-weight: 400;
    margin: 0;

    ${props => injectDNA(props)}
`