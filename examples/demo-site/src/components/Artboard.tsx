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
import { Matrix, MouseMapper, Point } from "./Playground";

interface Props extends DNA<ThemeExtension> {
    mouseMapper: MutableRefObject<MouseMapper>
}

type EditMode = "box" | "select"

const CursorBox = styled(Box)<{editMode: EditMode}>`
    cursor: ${props => props.editMode == "box" ? "cell" : "default"};
`

const Artboard: React.FC<Props> = ({children, mouseMapper, ...dna}) => {
    const playgroundRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const drawBoxRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

    const [ active, setActive ] = useState("")
    const [ components, setComponents ] = useState<RenderComponents>([])
    const [ editMode, setEditMode ] = useState<EditMode>("box")

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

    function mapCursorToArtboard(point: Point, refPos: { x: number, y: number, width: number, height: number}) {
        const { x, y } = mouseMapper.current.calculate(point)
        return {
            x: x - refPos.x,
            y: y - refPos.y
        }
    }

    useInteractable(playgroundRef, [components, editMode, setFlag], { initX: 0, initY: 0, offset: { x: 0, y: 0, width: 0, height: 0 }})
        .shouldStart(() => {
            if (editMode == "box") return true;
            if (!setFlag) setActive("")
            setFlag = ""
            return false;
        })
        .onStart(({e, ref}) => {
            const x = ref.offsetLeft
            const y = ref.offsetTop
            const width = ref.offsetWidth
            const height = ref.offsetHeight
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, { x, y, width, height})

            drawBoxRef.current!.style.opacity = "1"
            drawBoxRef.current!.style.left = mousePos.x + "px"
            drawBoxRef.current!.style.top = mousePos.y + "px"
            drawBoxRef.current!.style.width = "0px"
            drawBoxRef.current!.style.height = "0px"
            return { initX: mousePos.x, initY: mousePos.y, offset: { x, y, width, height }}
        })
        .onUpdate(({e, state}) => {
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, state.offset)
            drawBoxRef.current!.style.left = Math.min(mousePos.x, state.initX) + "px"
            drawBoxRef.current!.style.top = Math.min(mousePos.y, state.initY) + "px"
            drawBoxRef.current!.style.width = Math.abs(mousePos.x - state.initX) + "px"
            drawBoxRef.current!.style.height = Math.abs(mousePos.y - state.initY) + "px"
        })
        .onEnd(({e, state}) => {
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, state.offset)
            const width = Math.abs(mousePos.x - state.initX)
            const height = Math.abs(mousePos.y - state.initY)
            const left = Math.min(mousePos.x, state.initX)
            const top = Math.min(mousePos.y, state.initY)
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
            <Box ref={drawBoxRef} position="absolute" border="ghost" left={"calc(50% - 10px)"} top={"calc(50% - 10px)"} width={20} height={20}/>
        </CursorBox>
    )
}

export default Artboard