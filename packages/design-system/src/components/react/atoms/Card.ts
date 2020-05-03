import styled from "styled-components";
import Card from "../../primitives/atoms/Card";
import Box from "./Box";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled(Box)<DNA<ThemeExtension>>`
    ${props => Card(props, "react")}
`;