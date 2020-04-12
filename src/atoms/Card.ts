import styled from "styled-components"
import { DNA } from "../theme/index.d"
import { injectDNA } from "../dna/index"
import Box from "./Box"

export default styled(Box)<DNA>`
    ${props => injectDNA(props, {
        bg: "grey.1",
        radius: "small",
        p: "breathe",
        shadow: "default"
    })}
`