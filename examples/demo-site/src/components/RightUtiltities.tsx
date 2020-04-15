import React from "react";
import { DNA } from "../../../../src/theme/types";
import { Header2, Box } from "style-x";
import Resizable from "./Resizable";
import Draggable from "./Draggable";

interface Props extends DNA {

}
const RightUtilities: React.FC<Props> = ({children, ...dna}) => {
    return (
        <Resizable constraints={{minWidth: 100, maxWidth: 400}}>
            <Box p={10} width="fill" display="col" alignContent="start" justifyItems="start">
                <Header2 mb={20}>Components</Header2>
                <Draggable>
                    <Box width={100} height={100} border="ghost"></Box>
                </Draggable>
            </Box>
        </Resizable>
    )
}

export default RightUtilities