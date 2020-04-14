import styled from "styled-components/native";
import Button from "../../atoms/Button";
import { DNA } from "../../../theme/index.d";

export default styled.Button<DNA>`
    ${props => Button(props, "react")}
`;