import styled from "styled-components/native";
import Box from "../../atoms/Box";
import { DNA } from "../../../theme/types";

export default styled.View<DNA>`
    ${props => Box(props, "react")}
`;