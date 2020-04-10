import styled from "styled-components"
import { DNA } from "../theme/index.d"
import { injectDNA } from "../dna/index"

export default styled.div<{alignItems?: "center" | "flex-start" | "flex-end", justifyContent?: "center" | "space-between" | "space-evenly" | "space-around" | "flex-start" | "flex-end"} & DNA>`
    display: flex;
    flex-direction: row;
    align-items: ${props => props.alignItems || "flex-start"};
    justify-content: ${props => props.justifyContent || "flex-start"};

    ${props => injectDNA(props)}
`