import styled from "styled-components";
import { injectDNA } from "../dna/index";
import { injectFont } from "../dna/fonts";
import { DNA } from "../theme/index.d";

export default styled.h1<DNA>`
    color: ${props => props.theme.colors.foreground};
    margin: 0;

    ${props => injectFont(props, "header")}
    ${props => injectDNA(props)}
`