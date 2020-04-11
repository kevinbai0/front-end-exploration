import styled from "styled-components";
import { injectDNA } from "../dna/index";

export default styled.button`
    ${props => injectDNA(props, {
        bg: "action",
        fg: "background",
        font: "bigBody",
        px: "breathe",
    })}
`