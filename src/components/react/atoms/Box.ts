import styled from "styled-components";
import Box from "../../atoms/Box";
import { DNA } from "../../../theme/index.d";

export default styled.div<DNA>`
    ${props => Box(props, "react")}
`;