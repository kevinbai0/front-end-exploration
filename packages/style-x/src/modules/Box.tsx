import styled from "styled-components"
import { StyleX, constructLayout, constructSize } from "./withStyleX"

export const Box = styled.div<StyleX.Props>`
    ${props => (props.layout ? constructLayout(props.layout) : "")}
    ${props => (props.size ? constructSize("size", props.size) : "")}
    ${props => (props.maxSize ? constructSize("maxSize", props.maxSize) : "")}
    ${props => (props.minSize ? constructSize("minSize", props.minSize) : "")}
`
