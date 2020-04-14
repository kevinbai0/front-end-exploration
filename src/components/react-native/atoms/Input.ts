import styled from "styled-components/native";
import Input from "../../atoms/Input";
import { DNA } from "../../../theme/index.d";

export default styled.TextInput<DNA>`
    ${props => Input(props, "react")}
`;