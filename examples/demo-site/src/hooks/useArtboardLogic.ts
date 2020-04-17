import { MutableRefObject, useRef, useState, useEffect } from "react";
import useInteractable, { EventMethod } from "./useInteractable";
import { RenderComponent, RenderComponents } from "../components/ComponentTreeRenderer";
import { nanoid } from "nanoid";
import InteractiveBox, { InteractiveBoxProps } from "../components/InteractiveBox";
import { LayoutDim, MouseMapper, Point, EditMode } from "../utils/types";

export default function(mouseMapper: MutableRefObject<MouseMapper>) {
    const artboardRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
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
    function updateFlag(id: string) {
        if (!setFlag) {
            setActive(id)
            setFlag = id
        }
    }

    // map mouse coordinates to artboard
    function mapCursorToArtboard(point: Point, refPos: LayoutDim) {
        const { x, y } = mouseMapper.current.calculate(point)
        return { x: x - refPos.x, y: y - refPos.y }
    }

    const drawInteractions = drawBoxInteractions(drawBoxRef)

    useInteractable(artboardRef, [components, editMode, setFlag], { initialPoint: { x: 0, y: 0 }, offset: { x: 0, y: 0, width: 0, height: 0 }})
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
            drawInteractions.onStart(mousePos)
            return { initialPoint: mousePos, offset: { x, y, width, height }}
        })
        .onUpdate(({e, state}) => {
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, state.offset)
            drawInteractions.onUpdate(mousePos, state.initialPoint)
        })
        .onEnd(({e, state}) => {
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, state.offset)
            drawInteractions.onEnd(mousePos, state.initialPoint, (left, top, width, height) => {
                const id = nanoid()
                setComponents([...components, createInteractiveBox(id, left, top, width, height)])
                setActive(id)
            })
        })

    return {
        artboardRef, drawBoxRef, editMode, active, setActive: updateFlag, components,
    }
}

function drawBoxInteractions(ref: MutableRefObject<HTMLDivElement>) {
    function onStart({x, y}: Point) {
        ref.current!.style.opacity = "1"
        ref.current!.style.left = x + "px"
        ref.current!.style.top = y + "px"
        ref.current!.style.width = "0px"
        ref.current!.style.height = "0px"
    }
    function onUpdate({x,y}: Point, initialPoint: Point) {
        ref.current!.style.left = Math.min(x, initialPoint.x) + "px"
        ref.current!.style.top = Math.min(y, initialPoint.y) + "px"
        ref.current!.style.width = Math.abs(x - initialPoint.x) + "px"
        ref.current!.style.height = Math.abs(y - initialPoint.y) + "px"
    }
    function onEnd(pos: Point, initialPoint: Point, callback: (left: number, top: number, width: number, height: number) => void) {
        const width = Math.abs(pos.x - initialPoint.x)
        const height = Math.abs(pos.y - initialPoint.y)
        const left = Math.min(pos.x, initialPoint.x)
        const top = Math.min(pos.y, initialPoint.y)
        ref.current!.style.width = "0px"
        ref.current!.style.height = "0px"
        ref.current!.style.opacity = "0"
        if (width * height == 0) return;
        callback(left, top, width, height)
    }
    return {
        onStart,
        onUpdate,
        onEnd
    }
}

function createInteractiveBox(id: string, left: number, top: number, width: number, height: number): RenderComponent<InteractiveBoxProps> {
    return {
        id,
        component: {
            type: "component",
            fn: InteractiveBox,
            props: {
                id,
                componentDNA: {
                    bg: "grey.0",
                    border: "ghost",
                },
                position: "absolute",
                left,
                top,
                width, 
                height,
            }
        }
    }
}