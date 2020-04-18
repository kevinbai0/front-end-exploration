import React, { useRef } from "react";
import { Box, styled } from "style-x";
import { DNA, ThemeExtension } from "../../../../dist/types/src/theme/types";
import useInteractive from "../hooks/useInteractive";
interface Props extends DNA<ThemeExtension> {
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

    useInteractive(dragRef, [], { x: 0, y: 0})
        .onStart(({e, ref}) => {
            ref.style.transition = "background-color, box-shadow 0.3s ease"
            return { x: e.clientX, y: e.clientY }
        })
        .onUpdate(({e, ref, state}) => {
            if (!state) return;
            ref.style.transform = `translate(${e.clientX - state.x}px, ${e.clientY - state.y}px)`
        })
        .onEnd(({ref}) => {
            ref.style.transition = "background-color, box-shadow 0.3s ease, transform 0.2s ease"
            ref.style.transform = `translate(0)`
        })

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