import { ObjectValue, stringifyValue } from "./values"

type ComponentType = "Box" | "Text" | "Img"

export const createComponent = (type: ComponentType, properties: ObjectValue) => {
    let componentStr = `<${type} `
    const { children, ...props } = properties
    Object.keys(props).forEach(key => {
        componentStr += `${key}={${stringifyValue(props[key])}}`
    })
    componentStr += "/>"

    return componentStr
}
