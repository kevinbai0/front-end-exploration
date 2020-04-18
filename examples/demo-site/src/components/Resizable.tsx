import React, { useRef } from "react";
import { Box, styled } from "style-x";
import { DNA, ThemeExtension } from "../../../../dist/types/src/theme/types";
import { useEffect } from "react";
import useInteractive from "../hooks/useInteractive";

interface Props extends DNA<ThemeExtension> {
    constraints: {
        minWidth: number
        maxWidth: number
    }
}

const ResizeBox = styled(Box)`
    cursor: col-resize;
`

const Resizable: React.FC<Props> = ({children, constraints,...dna}) => {
    const resizeBox = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);


    useInteractive(resizeBox, [], {})
        .onUpdate(({e}) => {
            if (boxRef.current) {
                const newWidth = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, boxRef.current.offsetLeft + boxRef.current.offsetWidth - e.x))
                boxRef.current.style.width = newWidth + "px";
            }
        })

    return (
        <Box 
            width={300}
            height="100vh" 
            bg="grey.1"
            {...dna}
            display="row"
            rowLayout="auto 1fr"
            ref={boxRef}
        >
            <ResizeBox bg="grey.2" height="100%" width={5}
                ref={resizeBox}
            />

            {children}
        </Box>
    )
}

export default Resizable