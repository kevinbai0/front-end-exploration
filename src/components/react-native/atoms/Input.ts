import styled from "styled-components/native";
import Input from "../../atoms/Input";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.TextInput<DNA<ThemeExtension>>`
    ${props => Input(props, "react")}
`;