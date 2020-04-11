import styled from "styled-components";
import { injectDNA } from "../dna/index";
import { injectFont } from "../dna/fonts";
import { DNA } from "../theme/index.d";

export default styled.h1<DNA>`
    ${props => injectDNA(props, {
        fg: "foreground",
        m: 0,
        font: "header"
    })}
`