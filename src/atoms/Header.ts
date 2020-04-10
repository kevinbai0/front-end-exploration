import styled from "styled-components";
import { DNA, injectDNA } from "../dna/index";
import { injectFont } from "../dna/fonts";

export default styled.h1<DNA>`
    color: ${props => props.theme.colors.foreground};

    ${props => injectFont(props, "header")}
    ${props => injectDNA(props)}
`