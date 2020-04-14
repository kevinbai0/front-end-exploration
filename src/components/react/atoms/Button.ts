import styled from "styled-components";
import Button from "../../atoms/Button";
import { DNA } from "../../../theme/types";

export default styled.p<DNA>`
    ${props => Button(props, "react")}
`;