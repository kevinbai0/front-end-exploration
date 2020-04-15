import styled from "styled-components";
import Input from "../../atoms/Input";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.input<DNA<ThemeExtension>>`
    ${props => Input(props, "react")}
`;