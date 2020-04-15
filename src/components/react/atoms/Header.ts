import styled from "styled-components";
import Header from "../../atoms/Header";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.h1<DNA<ThemeExtension>>`
    ${props => Header(props, "react")}
`;