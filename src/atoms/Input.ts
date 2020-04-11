import styled from "styled-components";
import { DNA } from "../theme/index.d";
import { injectDNA } from "../dna/index";
import { matchColorToTheme } from "../dna/styling";

export default styled.input<DNA>`
    padding: 10px 8px;
    border-radius: 3px;

    ${props => injectDNA(props, {
        bg: "background",
        border: "ghost",
        font: "body"
    })}
`