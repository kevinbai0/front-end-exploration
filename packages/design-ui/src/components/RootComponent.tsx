import React from "react";
import { Box } from "../design-system";
import { DNA, ThemeExtension } from "../design-system/src/theme/types";

interface Props extends DNA<ThemeExtension> {

}

const RootComponent: React.FC<Props> = ({children, ...dna}) => {
    return (
        <Box {...dna}>
            
        </Box>
    )
}

export default RootComponent