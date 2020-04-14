import React from "react";
import { Box } from "style-x";
import { DNA } from "../../../../dist/types/src/theme/types";

interface Props extends DNA {

}

const RootComponent: React.FC<Props> = ({children, ...dna}) => {
    return (
        <Box {...dna}>
            
        </Box>
    )
}

export default RootComponent