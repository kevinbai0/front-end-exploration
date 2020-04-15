import styled from "styled-components/native";
import Body from "../../atoms/Body";
import { DNA, ThemeExtension } from "../../../theme/types";

export default styled.Text<DNA<ThemeExtension>>`
    ${props => Body(props, "react-native")}
`;