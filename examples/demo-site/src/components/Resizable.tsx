import React, { useRef } from "react";
import { useState } from "react";
import { Box, styled } from "style-x";
import { DNA } from "../../../../src/theme/types";
import { useEffect } from "react";

interface Props extends DNA {
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
    useEffect(() => {
        let down = false
        const resize = (e: MouseEvent) => {
            if (down && boxRef.current) {
                const newWidth = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, boxRef.current.offsetLeft + boxRef.current.offsetWidth - e.x))
                boxRef.current.style.width = newWidth + "px";
            }
        }
        const mouseDown = (e: MouseEvent) => (down = true)
        const mouseUp = (e: MouseEvent) => (down = false)
    
        window.addEventListener("mousemove", resize)
        resizeBox.current?.addEventListener("mousedown", mouseDown);
        resizeBox.current?.addEventListener("mouseup", mouseUp);

        return () => {
            window.removeEventListener("mousemove", resize);
            resizeBox.current?.removeEventListener("mousedown", mouseDown);
            resizeBox.current?.removeEventListener("mouseup", mouseUp);
        }
    }, [])
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