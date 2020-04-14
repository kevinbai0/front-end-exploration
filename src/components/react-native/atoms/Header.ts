import styled from "styled-components/native";
import Header from "../../atoms/Header";
import { DNA } from "../../../theme/types";

export default styled.Text<DNA>`
    ${props => Header(props, "react")}
`;