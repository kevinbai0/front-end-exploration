import styled from "styled-components/native";
import Header from "../../atoms/Header";
import { DNA } from "../../../theme/index.d";

export default styled.Text<DNA>`
    ${props => Header(props, "react")}
`;