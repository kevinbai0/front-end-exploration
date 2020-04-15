import styled from "styled-components";
import Button from "../../atoms/Button";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.p<DNA<ThemeExtension>>`
    ${props => Button(props, "react")}
`;