import { ThemeObject, DNA, Dimension } from "../theme/types";
import { splitStyle } from "./helpers";
import { InjectProperties } from "./index";

export const matchDimension = (_: DNA & ThemeObject, prop: string | number | (number | string)[]) => {
    if (typeof(prop) == "number") return [prop + "px"];
    if (typeof(prop) == "string") return [prop];

    return prop.map(value => typeof(value) == "string" ? value : value + "px");
}


export const injectDimensions: InjectProperties<Dimension> = (props, defaultProps) => {
    return [
        splitStyle("width", ["width"], matchDimension, props, defaultProps),
        splitStyle("height", ["height"], matchDimension, props, defaultProps),
        splitStyle("maxWidth", ["max-width"], matchDimension, props, defaultProps),
        splitStyle("maxHeight", ["max-height"], matchDimension, props, defaultProps),
        splitStyle("minWidth", ["min-width"], matchDimension, props, defaultProps),
        splitStyle("minHeight", ["min-height"], matchDimension, props, defaultProps),
    ]
}