import styled from "styled-components"
import { DNA } from "../theme/index.d"
import { injectDNA } from "../dna/index"

export default styled.div<DNA>`
    background-color: ${props => props.theme.colors.greys[0]};
    ${props => injectDNA(props)}

    padding: ${props => props.p || "10px"};
    border-radius: ${props => props.theme.borderRadius.small}px;
    ${props => props.theme.shadows.default}
`