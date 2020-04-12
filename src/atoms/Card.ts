import styled from "styled-components"
import { DNA } from "../theme/index.d"
import { injectDNA } from "../dna/index"

export default styled.div<DNA>`
    padding: ${props => props.p || "10px"};
    ${props => props.theme.shadows.default}

    ${props => injectDNA(props, {
        bg: "grey.1",
        radius: "small",
        p: "breathe",
        justifyContent: "center",
        alignContent: "center"
    })}
`