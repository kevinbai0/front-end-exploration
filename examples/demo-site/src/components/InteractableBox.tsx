import React, { useRef } from "react";
import { Box, styled } from "style-x"
import { DNA } from "../../../../dist/types/src/theme/types";
import useInteractable from "../hooks/useInteractable";
import { MutableRefObject } from "react";
import { getPos } from "../helpers";

interface Props extends DNA {
    componentDNA: DNA
    active: string
    setActive?: (id: string) => void
    id: string
}

const InteractableBox: React.FC<Props> = ({children, componentDNA, active, setActive, id, ...dna}) => {
    const drawBoxRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

    const mouseDown = (dot: "top-left" | "bottom-left" | "top-right" | "bottom-right") => {
        console.log(dot)
    }

    const interactive = useInteractable(drawBoxRef, [active], { x: 0, y: 0, initDims: {x: 0, y: 0, absX: 0, absY: 0, height: 0, width: 0}, state: "move" })
        .shouldStart(() => {
            setActive && setActive(id)
            return true
        })
        .onStart(({e, ref, state}) => {
            const { x, y } = getPos(ref)
            return { 
                x: e.clientX, 
                y: e.clientY, 
                initDims: {
                    x: ref.offsetLeft,
                    y: ref.offsetTop,
                    absX: x, 
                    absY: y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight
                },
                state: "move"
            }
        })
        .onUpdate(({e, ref, state}) => {
            if (state.state == "move") {
                ref.style.left = (state.initDims.x + e.clientX - state.x) + "px"
                ref.style.top = (state.initDims.y + e.clientY - state.y) + "px"
            }
            else if (state.state == "drag-tl") {
                ref.style.left = Math.min(state.initDims.x + state.initDims.width, state.initDims.x + e.clientX - state.x) + "px"
                ref.style.top = Math.min(state.initDims.y + state.initDims.height, state.initDims.y + e.clientY - state.y) + "px"
                ref.style.width = Math.abs(state.initDims.width - e.clientX + state.initDims.absX) + "px"
                ref.style.height = Math.abs(state.initDims.height - e.clientY + state.initDims.absY) + "px"
            }
            else if (state.state == "drag-tr") {
                ref.style.left = Math.min(state.initDims.x, state.initDims.x + e.clientX - state.x + state.initDims.width) + "px"
                ref.style.top = Math.min(state.initDims.y + state.initDims.height, state.initDims.y + e.clientY - state.y) + "px"
                ref.style.width = Math.abs(-e.clientX + state.initDims.absX) + "px"
                ref.style.height = Math.abs(state.initDims.height - e.clientY + state.initDims.absY) + "px"
            }
            else if (state.state == "drag-bl") {
                ref.style.left = Math.min(state.initDims.x + state.initDims.width, state.initDims.x + e.clientX - state.x) + "px"
                ref.style.top = Math.min(state.initDims.y, state.initDims.y + e.clientY - state.y + state.initDims.height) + "px"
                ref.style.width = Math.abs(state.initDims.width - e.clientX + state.initDims.absX) + "px"
                ref.style.height = Math.abs(-e.clientY + state.initDims.absY) + "px"
            }
            else if (state.state == "drag-br") {
                ref.style.left = Math.min(state.initDims.x, state.initDims.x + e.clientX - state.x + state.initDims.width) + "px"
                ref.style.top = Math.min(state.initDims.y, state.initDims.y + e.clientY - state.y + state.initDims.height) + "px"
                ref.style.width = Math.abs(-e.clientX + state.initDims.absX) + "px"
                ref.style.height = Math.abs(-e.clientY + state.initDims.absY) + "px"
            }
        })
        .onEnd(({e, state, ref}) => {
            if (state.state == "move") {
                ref.style.left = (e.clientX - state.x + state.initDims.x) + "px"
                ref.style.top = (e.clientY - state.y + state.initDims.y) + "px"
            }
        })

    return (
        <InteractiveBox ref={drawBoxRef} {...dna} active={active == id}>
            <Box width="fill" height="fill" {...componentDNA}>
                {children}
            </Box>
            {active == id && (
                <>
                    <EditDot width={10} height={10} left={-7} top={-7} bg="background" onMouseDown={() => interactive.updateState({ state: "drag-tl"})}/>
                    <EditDot width={10} height={10} right={-7} top={-7} bg="background" onMouseDown={() => interactive.updateState({ state: "drag-tr"})}/>
                    <EditDot width={10} height={10} left={-7} bottom={-7} bg="background" onMouseDown={() => interactive.updateState({ state: "drag-bl"})}/>
                    <EditDot width={10} height={10} right={-7} bottom={-7} bg="background" onMouseDown={() => interactive.updateState({ state: "drag-br"})}/>
                </>
            )}
        </InteractiveBox>
    )
}

export default InteractableBox

const InteractiveBox = styled(Box)<{active: boolean}>`
    ${props => props.active && `border: 1px solid ${props.theme.colors.action};`};
`

const EditDot = styled(Box)`
    position: absolute;
    border: 2px solid ${props => props.theme.colors.action};
    border-radius: 10px;
`