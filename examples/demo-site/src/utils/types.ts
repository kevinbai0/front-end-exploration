export interface EditState {
    mode: {
        type: "box"
    } | {
        type: "select"
        value: "no-selection" | "selecting" |"selected" | "resizing" | "translating"
    }
    selected: string[]
}

export type LayoutDim = { x: number, y: number, width: number, height: number }

export type Matrix = [number, number, number, number, number, number]
export type Point = {
    x: number, y: number
}

export type MouseMapper = {anchor: {x: number, y: number, scale: number}, calculate: (this: MouseMapper, {x, y}: Point) => Point}


export type EventMethod<T, S extends HTMLElement> = (props: { e: MouseEvent, ref: S, state: T }) => T | undefined | void
export type EventListener<S> = {
    event: "mousedown" | "mouseup" | "mousemove"
    method: (e: MouseEvent, ref: S) => void
}

export type LifeCycleMethod<T, S extends HTMLElement, R> = (props: { e: MouseEvent, ref: S, state: T}) => R
export type LifeCycle<S> = {
    event: "should-start",
    method: (e: MouseEvent, ref: S) => boolean
}
