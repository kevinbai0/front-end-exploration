import { ThemeFont, ThemeFontFamily, ThemeObject, ThemeFontSize, Font, DNA, ThemeExtension } from "../theme/types"
import { InjectProperties } from "./index";
import { splitStyle } from "./helpers";

const matchFontToTheme = (props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>, prop: ThemeFont<ThemeExtension>) => {
    if (!props.theme.fonts[prop]) return [];
    const { family, size, weight } = props.theme.fonts[prop]
    const fontFamily = props.theme.fontFamily[family as ThemeFontFamily<ThemeExtension>] || family
    const fontSize = props.theme.fontSizes[size as ThemeFontSize<ThemeExtension>] || []

    if (typeof(fontSize) == "number") {
        return [`${weight} ${fontSize}px ${fontFamily}`]
    }
    
    return fontSize.map(size => `${weight} ${size}px ${fontFamily}`)
}

export const injectFonts: InjectProperties<Font<ThemeExtension>> = (props, defaultProps) => {
    return [
        splitStyle("font", ["font"], matchFontToTheme, props, defaultProps)
    ]
}