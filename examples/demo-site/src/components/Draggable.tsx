import React, { useRef } from "react";
import { useState } from "react";
import { Box, styled } from "style-x";
import { DNA } from "../../../../src/theme/types";
import { useEffect } from "react";
interface Props extends DNA {
}

const ResizeBox = styled(Box)`
    cursor: grab;
    transition: background-color, box-shadow 0.2s ease;
    :hover {
        background-color: ${props => props.theme.colors["grey.2"]};
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.2);
    }

    :active {
        background-color: ${props => props.theme.colors["grey.2"]};
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.2);
    }
`

const Draggable: React.FC<Props> = ({children,...dna}) => {
    const dragRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let down = false
        let start = { x: 0, y: 0 }
        const resize = (e: MouseEvent) => {
            if (down && dragRef.current) {
                dragRef.current.style.transform = `translate(${e.clientX - start.x}px, ${e.clientY - start.y}px)`
            }
        }
        const mouseDown = (e: MouseEvent) => {
            dragRef.current!.style.transition = "background-color, box-shadow 0.3s ease"
            down = true
            start = {
                x: e.clientX, y: e.clientY
            }
        }
        const mouseUp = (e: MouseEvent) => {
            down = false
            if (dragRef.current) {
                dragRef.current!.style.transition = "background-color, box-shadow 0.3s ease, transform 0.2s ease"
                dragRef.current.style.transform = `translate(0)`
            }
        }
    
        window.addEventListener("mousemove", resize)
        dragRef.current?.addEventListener("mousedown", mouseDown);
        window.addEventListener("mouseup", mouseUp);

        return () => {
            window.removeEventListener("mousemove", resize);
            dragRef.current?.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mouseup", mouseUp);
        }
    }, [])
    return (
        <ResizeBox 
            ref={dragRef}
            {...dna}
        >
            {children}
        </ResizeBox>
    )
}

export default Draggable