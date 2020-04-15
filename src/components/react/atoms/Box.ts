import styled from "styled-components";
import Box from "../../atoms/Box";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.div<DNA<ThemeExtension>>`
    ${props => Box(props, "react")}
`;