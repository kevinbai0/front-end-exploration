import styled from "styled-components";
import Input from "../../primitives/atoms/Input";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.input<DNA<ThemeExtension>>`
    ${props => Input(props, "react")}
`;