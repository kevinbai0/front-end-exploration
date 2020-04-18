import { MutableRefObject, useRef, useState, useEffect, useContext } from "react";
import useInteractive from "./useInteractive";
import { RenderComponent, RenderComponents, RenderableComponentProps, StyleSetterRef } from "../components/Playground/ComponentTreeRenderer";
import { nanoid } from "nanoid";
import InteractiveBox, { InteractiveBoxProps } from "../components/Playground/InteractiveBox";
import { LayoutDim, MouseMapper, Point, EditMode } from "../utils/types";
import { DefaultTheme } from "styled-components";
import { ThemeContext } from "style-x"

export default function(mouseMapper: MutableRefObject<MouseMapper>) {
    const artboardRef = useRef<HTMLDivElement>(null)
    const drawBoxRef = useRef<HTMLDivElement>(null)
    const componentsStore = useRef<{
        [key: string]: {
            component: RenderComponent<RenderableComponentProps>,
            ref: MutableRefObject<StyleSetterRef>
        }
    }>({})

    const theme = useContext(ThemeContext)

    const [ active, setActive ] = useState<string[]>([])
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
            setActive([...active.filter(val => val != id), id])
            setFlag = id
        }
    }

    // map mouse coordinates to artboard
    function mapCursorToArtboard(point: Point, refPos: LayoutDim) {
        const { x, y } = mouseMapper.current.calculate(point)
        return { x: x - refPos.x, y: y - refPos.y }
    }

    const drawBoxInteractions = createDrawBoxInteractions(drawBoxRef, theme)

    useInteractive(artboardRef, [components, editMode, setFlag], { 
        initialPoint: { x: 0, y: 0 },
        offset: { x: 0, y: 0, width: 0, height: 0 }
    })
        .shouldStart(() => {
            if (editMode == "box") return true;
            if (!setFlag) setActive([])
            setFlag = ""
            return true;
        })
        .onStart(({e, ref}) => {
            const offset: LayoutDim = {
                x: ref.offsetLeft, y: ref.offsetTop, width: ref.offsetWidth, height: ref.offsetHeight
            }
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, offset)
            drawBoxInteractions.onStart(mousePos, editMode)
            return { initialPoint: mousePos, offset }
        })
        .onUpdate(({e, state}) => {
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, state.offset)
            const rectDim = drawBoxInteractions.onUpdate(mousePos, state.initialPoint)

            // calculate overlap
            const keys = Object.entries(componentsStore.current)
                .filter((pair) => hasOverlap(rectDim, pair[1].ref.current.getDimensions()))
                .map(pair => pair[0])

            // diff active and keys
            const equal = keys.length == active.length && active.filter((value, i) => keys[i] != value).length == 0

            if (!equal) {
                setActive(keys)
            }
        })
        .onEnd(({e, state}) => {
            const mousePos = mapCursorToArtboard({x: e.clientX, y: e.clientY}, state.offset)
            drawBoxInteractions.onEnd(mousePos, state.initialPoint, editMode, (offset) => {
                const id = nanoid()
                setComponents([...components, createInteractiveBox(id, offset)])
                setActive([...active, id])
            })
        })

    return {
        artboardRef, drawBoxRef, editMode, active, setActive: updateFlag, components, componentsStore
    }
}

function hasOverlap(rect1: LayoutDim, rect2: LayoutDim) {
    // check if any points in rect1 are in rect 2
    if (pointInRect({ x: rect1.x, y: rect1.y }, rect2)) return true
    if (pointInRect({ x: rect1.x, y: rect1.y + rect1.height }, rect2)) return true
    if (pointInRect({ x: rect1.x + rect1.width, y: rect1.y }, rect2)) return true
    if (pointInRect({ x: rect1.x + rect1.width, y: rect1.y + rect1.height }, rect2)) return true
    // see if points in rect2 are in rect1
    if (pointInRect({ x: rect2.x, y: rect2.y }, rect1)) return true
    if (pointInRect({ x: rect2.x, y: rect2.y + rect2.height }, rect1)) return true
    if (pointInRect({ x: rect2.x + rect2.width, y: rect2.y }, rect1)) return true
    if (pointInRect({ x: rect2.x + rect2.width, y: rect2.y + rect2.height }, rect1)) return true
    return false
}

function pointInRect(point: Point, rect: LayoutDim) {
    return point.x >= rect.x && point.y >= rect.y && point.x <= rect.x + rect.width && point.y <= rect.y + rect.height
}

function createDrawBoxInteractions(ref: MutableRefObject<HTMLDivElement>, theme: DefaultTheme) {
    function onStart({x, y}: Point, mode: EditMode) {
        ref.current!.style.opacity = "1"
        ref.current!.style.left = x + "px"
        ref.current!.style.top = y + "px"
        ref.current!.style.width = "0px"
        ref.current!.style.height = "0px"
        if (mode == "box") {
            ref.current.style.backgroundColor = "white";
            ref.current.style.border = "1px solid #888888"
        }
        else if (mode == "select") {
            console.log("Select mode")
            ref.current.style.backgroundColor = "rgba(37,175,239,0.5)"
            ref.current.style.border = "none"
        }
    }
    function onUpdate({x,y}: Point, initialPoint: Point) {
        const dim: LayoutDim = {
            x: Math.min(x, initialPoint.x),
            y: Math.min(y, initialPoint.y),
            width: Math.abs(x - initialPoint.x),
            height: Math.abs(y - initialPoint.y)
        }
        ref.current!.style.left = dim.x + "px"
        ref.current!.style.top = dim.y + "px"
        ref.current!.style.width = dim.width + "px"
        ref.current!.style.height = dim.height + "px"
        return dim
    }
    function onEnd(pos: Point, initialPoint: Point, editMode: EditMode, callback: (dimensions: LayoutDim) => void) {
        const width = Math.abs(pos.x - initialPoint.x)
        const height = Math.abs(pos.y - initialPoint.y)
        const left = Math.min(pos.x, initialPoint.x)
        const top = Math.min(pos.y, initialPoint.y)

        ref.current!.style.width = "0px"
        ref.current!.style.height = "0px"
        ref.current!.style.opacity = "0"
        if (width * height == 0 || editMode == "select") return;
        callback({ x: left, y: top, width, height })
    }
    return {
        onStart,
        onUpdate,
        onEnd
    }
}

function createInteractiveBox(id: string, dim: LayoutDim): RenderComponent<InteractiveBoxProps> {
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
                left: dim.x,
                top: dim.y,
                width: dim.width, 
                height: dim.height,
            }
        }
    }
}