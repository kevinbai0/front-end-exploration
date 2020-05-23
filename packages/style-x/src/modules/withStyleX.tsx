import { css } from "styled-components"

export namespace StyleX {
    export interface Props {
        layout?: LayoutProps
        size?: SizeProps
        maxSize?: SizeProps
        minSize?: SizeProps
    }
    export type SizeProps = [number | string] | [number | string, number | string]
    export interface LayoutProps {
        type: "row" | "column" | "none"
        align: AlignmentType
        justify: AlignmentType
    }
    export interface Cond<T> {
        condition: T
        values: [Range, (range: Range) => void]
    }
    export type AlignmentType = "start" | "center" | "end" | "space_between"
}

export const createLayout = (props: Partial<StyleX.LayoutProps>) => ({
    type: props.type || "row",
    align: props.align || "start",
    justify: props.justify || "start"
})

export const constructLayout = (props: Partial<StyleX.LayoutProps>) => {
    const layout = createLayout(props)
    const layoutString = (() => {
        switch (layout.type) {
            case "row":
                return css`
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-auto-flow: column;
                `
            case "column":
                return css`
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-auto-flow: row;
                `
            case "none":
                return css`
                    display: none;
                `
        }
    })()

    const align = layout.align.replace(/_/g, "-")
    const justify = layout.justify.replace(/_/g, "-")

    return css`
        ${layoutString}
        align-items: ${align};
        justify-items: ${justify};
    `
}

type Dimension = "width" | "height" | "max-width" | "max-height" | "min-width" | "min-height"

const constructDimension = (name: Dimension, prop: string | number) => {
    if (prop == "fill") {
        return `
            ${name}: 100%;
            ${name}: -moz-available;
            ${name}: -webkit-fill-available;
            ${name}: fill-available;
        `
    }
    if (prop == "auto") {
        return `
            ${name}: auto;
        `
    }

    return `
        ${name}: ${typeof prop == "number" ? prop + "px" : prop};
    `
}

export const constructSize = (
    type: "size" | "maxSize" | "minSize",
    props: StyleX.SizeProps | undefined
) => {
    const size = props || ["auto"]
    const width = size[0]
    const height = size.length == 2 ? size[1] : size[0]

    const attrs = ((): {
        width: Dimension
        height: Dimension
    } => {
        switch (type) {
            case "size": {
                return {
                    width: "width",
                    height: "height"
                }
            }
            case "maxSize": {
                return {
                    width: "max-width",
                    height: "max-height"
                }
            }
            case "minSize": {
                return {
                    width: "min-width",
                    height: "min-height"
                }
            }
        }
    })()
    return css`
        ${constructDimension(attrs.width, width)};
        ${constructDimension(attrs.height, height)};
    `
}
