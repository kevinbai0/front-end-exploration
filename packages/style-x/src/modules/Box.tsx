import styled from "styled-components"
import { StyleX, constructLayout, constructSize } from "./withStyleX"

export const Box = styled.div<StyleX.Props>`
    ${props => constructLayout(props.layout)}
    ${props => constructSize("size", props.size)}
    ${props => constructSize("maxSize", props.maxSize)}
    ${props => constructSize("minSize", props.minSize)}
`
