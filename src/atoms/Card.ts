import styled from "styled-components"
import { Spacing, injectSpace } from "../dna/spacing"

export default styled.div<Spacing>`
    background-color: ${props => props.theme.colors.greys[0]};
    ${props => injectSpace(props)}

    padding: ${props => props.p || "10px"};
    border-radius: ${props => props.theme.borderRadius.small}px;
    ${props => props.theme.shadows.default}
`