import { ThemeObject, DNA, LayoutContent, LayoutItems, Position } from "../theme/types";
import { splitStyle } from "./helpers";
import { InjectProperties } from "./index";
import { matchDimension } from "./dimensions";

export const matchLayoutAlignment = (_: DNA & ThemeObject, prop: LayoutContent | LayoutItems) => [prop]

export const injectPosition: InjectProperties<Position> = (props, defaultProps) => {
    return [
        splitStyle("position", ["position"], matchDimension, props, defaultProps),
        splitStyle("left", ["left"], matchDimension, props, defaultProps),
        splitStyle("right", ["right"], matchDimension, props, defaultProps),
        splitStyle("top", ["top"], matchDimension, props, defaultProps),
        splitStyle("bottom", ["bottom"], matchDimension, props, defaultProps),
    ]
}