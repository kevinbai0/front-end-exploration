import styled from "styled-components/native";
import Button from "../../atoms/Button";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.Button<DNA<ThemeExtension>>`
    ${props => Button(props, "react")}
`;