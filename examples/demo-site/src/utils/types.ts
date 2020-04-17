export type EditMode = "box" | "select"

export type LayoutDim = { x: number, y: number, width: number, height: number }

export type Matrix = [number, number, number, number, number, number]
export type Point = {
    x: number, y: number
}

export type MouseMapper = {anchor: {x: number, y: number, scale: number}, calculate: (this: MouseMapper, {x, y}: Point) => Point}