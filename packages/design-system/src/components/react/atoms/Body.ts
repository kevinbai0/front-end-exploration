import styled from "styled-components";
import Body from "../../primitives/atoms/Body";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.p<DNA<ThemeExtension>>`
    ${props => Body(props, "react")}
`;