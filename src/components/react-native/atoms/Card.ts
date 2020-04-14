import styled from "styled-components/native";
import Card from "../../atoms/Card";
import Box from "./Box";
import { DNA } from "../../../theme/index.d";

export default styled(Box)<DNA>`
    ${props => Card(props, "react")}
`;