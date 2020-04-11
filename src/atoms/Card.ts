import styled from "styled-components"
import { DNA } from "../theme/index.d"
import { injectDNA } from "../dna/index"
import { matchColorToTheme } from "../dna/styling"

export default styled.div<DNA>`
    padding: ${props => props.p || "10px"};
    border-radius: ${props => props.theme.borderRadius.small}px;
    ${props => props.theme.shadows.default}

    ${props => injectDNA(props, {
        bg: "grey.1"
    })}
`