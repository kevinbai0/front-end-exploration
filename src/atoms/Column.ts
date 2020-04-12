import styled from "styled-components"
import { DNA } from "../theme/index.d"
import { injectDNA } from "../dna/index"

export default styled.div<DNA>`
    display: flex;
    flex-direction: column;
    ${props => injectDNA(props)}
`