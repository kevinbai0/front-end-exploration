import React from "react";
import { DNA, ThemeExtension } from "../../../design-system/src/theme/types";
import { Header2, Box } from "style-x";
import Resizable from "./Resizable";
import Draggable from "./Draggable";

interface Props extends DNA<ThemeExtension> {

}
const Toolkit: React.FC<Props> = ({children, ...dna}) => {
    return (
        <Box p={10} width={10} height="fill" display="col" alignContent="start" justifyItems="start" bg="grey.1">
            
        </Box>
    )
}

export default Toolkit