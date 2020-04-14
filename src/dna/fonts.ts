import { ThemeFont, ThemeFontFamily, ThemeObject, ThemeFontSize, Font, DNA } from "../theme/types"
import { InjectProperties } from "./index";
import { splitStyle } from "./helpers";

const matchFontToTheme = (props: DNA & ThemeObject, prop: ThemeFont) => {
    if (!props.theme.fonts[prop]) return [];
    const { family, size, weight } = props.theme.fonts[prop]
    const fontFamily = props.theme.fontFamily[family as ThemeFontFamily] || family
    const fontSize = props.theme.fontSizes[size as ThemeFontSize] || []

    if (typeof(fontSize) == "number") {
        return [`${weight} ${fontSize}px ${fontFamily}`]
    }
    
    return fontSize.map(size => `${weight} ${size}px ${fontFamily}`)
}

export const injectFonts: InjectProperties<Font> = (props, defaultProps) => {
    return [
        splitStyle("font", ["font"], matchFontToTheme, props, defaultProps)
    ]
}