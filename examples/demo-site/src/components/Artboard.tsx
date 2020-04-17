import React, { useRef } from "react";
import { Box, styled } from "style-x"
import { DNA, ThemeExtension } from "../../../../dist/types/src/theme/types";
import useInteractable from "../hooks/useInteractable";
import { MutableRefObject } from "react";
import ComponentTreeRenderer, { RenderComponents } from "./ComponentTreeRenderer";
import { useState } from "react";
import { nanoid } from "nanoid"
import { getPos } from "../helpers";
import { useEffect } from "react";
import InteractiveBox from "./InteractiveBox";
import { Matrix } from "./Playground";

interface Props extends DNA<ThemeExtension> {
    matrixState: MutableRefObject<Matrix>
}

type EditMode = "box" | "select"

const CursorBox = styled(Box)<{editMode: EditMode}>`
    cursor: ${props => props.editMode == "box" ? "cell" : "default"};
`

const Artboard: React.FC<Props> = ({children, matrixState, ...dna}) => {
    const playgroundRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const drawBoxRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

    const [ active, setActive ] = useState("")
    const [ components, setComponents ] = useState<RenderComponents>([])
    const [ editMode, setEditMode ] = useState<EditMode>("box")

    function mapCursorToMatrixState(coord: { x: number, y: number }, state: Matrix) {
        return {
            x: (coord.x + state[4]) * state[0], y: (coord.y + state[5]) * state[0]
        }
    }
    function mapYToMatrixState(value: number, state: Matrix) {
        return (value + state[5]) * state[0]
    }

    useEffect(() => {
        const method = (e: KeyboardEvent) => {
            if (e.key == "b") setEditMode("box")
            else if (e.key == "v") setEditMode("select")
        }
        window.addEventListener("keyup", method)
        return () => window.removeEventListener("keyup", method)
    })

    let setFlag = ""
    function asdf(id: string) {
        if (!setFlag) {
            setActive(id)
            setFlag = id
        }
    }

    useEffect(() => {
        const { x, y } = getPos(playgroundRef.current)
        const width = playgroundRef.current.offsetWidth
        const midX = width / 2
        const call = (e: MouseEvent) => console.log((e.clientX - x - midX - matrixState.current[4]) / matrixState.current[0], matrixState.current[4], matrixState.current[0])
        window.addEventListener("mousemove", call)
        return () => window.removeEventListener("mousemove", call)
    })

    useInteractable(playgroundRef, [components, editMode, setFlag], { x: 0, y: 0, offsetX: 0, offsetY: 0 })
        .shouldStart(() => {
            if (editMode == "box") return true;
            if (!setFlag) setActive("")
            setFlag = ""
            return false;
        })
        .onStart(({e, ref}) => {
            const { x, y } = mapCursorToMatrixState(getPos(ref), matrixState.current)
            
            drawBoxRef.current!.style.opacity = "1"
            drawBoxRef.current!.style.left = e.clientX - x + "px"
            drawBoxRef.current!.style.top = e.clientY - y + "px"
            drawBoxRef.current!.style.width = "0px"
            drawBoxRef.current!.style.height = "0px"
            return { x: e.clientX, y: e.clientY, offsetX: x, offsetY: y }
        })
        .onUpdate(({e, state}) => {
            drawBoxRef.current!.style.left = Math.min(e.clientX - state.offsetX, state.x - state.offsetX) - matrixState.current[4] + "px"
            drawBoxRef.current!.style.top = Math.min(e.clientY - state.offsetY, state.y - state.offsetY) + "px"
            drawBoxRef.current!.style.width = Math.abs(e.clientX - state.x) / matrixState.current[0] + "px"
            drawBoxRef.current!.style.height = Math.abs(e.clientY - state.y) / matrixState.current[0] + "px"
        })
        .onEnd(({e, state, ref}) => {
            const { x, y } = mapCursorToMatrixState(getPos(ref), matrixState.current)
            const width = Math.abs(e.clientX - state.x) / matrixState.current[0]
            const height = Math.abs(e.clientY - state.y) / matrixState.current[0]
            const left = Math.min(e.clientX, state.x) - x
            const top = Math.min(e.clientY, state.y) - y
            drawBoxRef.current!.style.width = "0px"
            drawBoxRef.current!.style.height = "0px"
            drawBoxRef.current!.style.opacity = "0"
            if (width * height == 0) return;
            const id = nanoid()
            setComponents([...components, {
                id,
                component: {
                    type: "component",
                    fn: InteractiveBox,
                    props: {
                        id,
                        left,
                        top,
                        width,
                        height,
                        position: "absolute",
                        componentDNA: {
                            bg: "grey.0",
                            border: "ghost",
                        },
                    }
                }
            }])
            setActive(id)
        })

    return (
        <CursorBox {...dna} ref={playgroundRef} editMode={editMode}>
            <ComponentTreeRenderer components={components} active={active} setActive={asdf}/>
            <Box ref={drawBoxRef} position="absolute" border="ghost"/>
        </CursorBox>
    )
}

export default Artboard