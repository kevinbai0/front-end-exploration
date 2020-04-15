import styled from "styled-components/native";
import Box from "../../atoms/Box";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.View<DNA<ThemeExtension>>`
    ${props => Box(props, "react")}
`;