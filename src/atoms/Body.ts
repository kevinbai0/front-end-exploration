import styled from "styled-components";
import { injectDNA } from "../dna/index";
import { DNA } from "../theme/index.d";

export default styled.p<DNA>`
    color: ${props => props.theme.colors.foreground};
    font-size: ${props => props.theme.fontSizes.body}px;
    font-weight: 400;
    margin: 0;

    ${props => injectDNA(props)}
`