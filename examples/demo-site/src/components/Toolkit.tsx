import React from "react";
import { DNA } from "../../../../src/theme/types";
import { Header2, Box } from "style-x";
import Resizable from "./Resizable";
import Draggable from "./Draggable";

interface Props extends DNA {

}
const Toolkit: React.FC<Props> = ({children, ...dna}) => {
    return (
        <Box p={10} width={10} height="fill" display="col" alignContent="start" justifyItems="start" bg="grey.2">
            
        </Box>
    )
}

export default Toolkit