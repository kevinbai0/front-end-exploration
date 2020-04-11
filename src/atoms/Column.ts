import styled from "styled-components"
import { DNA, FlexGridDisplayOptions } from "../theme/index.d"
import { injectDNA } from "../dna/index"
import { injectFlexGridDisplayOptions } from "../dna/flex";

export default styled.div<FlexGridDisplayOptions & DNA>`
    display: flex;
    flex-direction: column;
    ${props => injectFlexGridDisplayOptions(props)}
    ${props => injectDNA(props)}
`