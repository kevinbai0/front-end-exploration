import styled from "styled-components"
import { Spacing, injectSpace } from "../dna/spacing"

export default styled.div<{alignItems?: "center" | "flex-start" | "flex-end", justifyContent?: "center" | "space-between" | "space-evenly" | "space-around" | "flex-start" | "flex-end"} & Spacing>`
    display: flex;
    flex-direction: row;
    align-items: ${props => props.alignItems || "flex-start"};
    justify-content: ${props => props.justifyContent || "flex-start"};

    ${props => injectSpace(props)}
`