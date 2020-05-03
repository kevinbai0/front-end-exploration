import styled from "styled-components";
import { DNA, ThemeExtension } from "../../../theme/types";
import Header2 from "../../primitives/atoms/Header2";

export default styled.h2<DNA<ThemeExtension>>`
    ${props => Header2(props, "react")}
`;