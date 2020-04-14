import styled from "styled-components";
import { DNA } from "../../../theme/types";
import Header2 from "../../atoms/Header2";

export default styled.h2<DNA>`
    ${props => Header2(props, "react")}
`;