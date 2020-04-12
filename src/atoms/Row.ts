import styled from "styled-components"
import { injectDNA } from "../dna/index"
import { DNA } from "../theme/index.d"

export default styled.div<DNA>`
    display: grid;
    grid-template-rows: 1fr;
    grid-auto-flow: column;
    ${props => injectDNA(props)}
`