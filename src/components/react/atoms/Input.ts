import styled from "styled-components";
import Input from "../../atoms/Input";
import { DNA } from "../../../theme/types";

export default styled.input<DNA>`
    ${props => Input(props, "react")}
`;