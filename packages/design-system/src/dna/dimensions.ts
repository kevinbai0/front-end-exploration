import { ThemeObject, DNA, Dimension, ThemeExtension } from "../theme/types";
import { splitStyle } from "./helpers";
import { InjectProperties } from "./index";



export const matchDimension = (_: DNA<ThemeExtension> & ThemeObject<ThemeExtension>, prop: string | number | (number | string)[]) => {
    if (typeof(prop) == "number") return [prop + "px"];
    if (typeof(prop) == "string") return [prop];

    return prop.map(value => typeof(value) == "string" ? value : value + "px");
}

const mapSize = (prop: string, key: "width" | "height") => {
    if (prop == "fill") {
        return `
            ${key}: 100%;
            ${key}: -moz-available;
            ${key}: -webkit-fill-available;
            ${key}: fill-available;
        `
    }
    return prop
}

export const matchSizeProp = (_: DNA<ThemeExtension> & ThemeObject<ThemeExtension>, prop: string | number | (string | number)[], key: "width" | "height") => {
    if (typeof(prop) == "number") return [prop + "px"];
    if (typeof(prop) == "string") return [mapSize(prop, key)];

    return prop.map(value => 
        typeof(value) == "string" 
            ? mapSize(value, key) 
            : value + "px");
}

export const injectDimensions: InjectProperties<Dimension> = (props, defaultProps) => {
    return [
        splitStyle("width", ["width"], (_, prop) => matchSizeProp(_, prop, "width"), props, defaultProps),
        splitStyle("height", ["height"], (_, prop) => matchSizeProp(_, prop, "height"), props, defaultProps),
        splitStyle("maxWidth", ["max-width"], matchDimension, props, defaultProps),
        splitStyle("maxHeight", ["max-height"], matchDimension, props, defaultProps),
        splitStyle("minWidth", ["min-width"], matchDimension, props, defaultProps),
        splitStyle("minHeight", ["min-height"], matchDimension, props, defaultProps),
    ]
}