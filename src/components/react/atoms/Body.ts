import styled from "styled-components";
import Body from "../../atoms/Body";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.p<DNA<ThemeExtension>>`
    ${props => Body(props, "react")}
`;