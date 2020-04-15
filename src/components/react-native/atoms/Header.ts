import styled from "styled-components/native";
import Header from "../../atoms/Header";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.Text<DNA<ThemeExtension>>`
    ${props => Header(props, "react")}
`;