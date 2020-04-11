import { ThemeFont, ThemeExtension, ThemeFontFamily, ThemeObject, ThemeFontSize, Font } from "../theme/index.d"
import { InjectProperties } from "./index";

const matchFontToTheme = <T extends Font<ThemeExtension> & ThemeObject<ThemeExtension>>(props: T, prop: ThemeFont<ThemeExtension>) => {
    if (!props.theme.fonts[prop]) return [];
    const { family, size, weight } = props.theme.fonts[prop]
    const fontFamily = props.theme.fontFamily[family as ThemeFontFamily<ThemeExtension>] || family
    const fontSize = props.theme.fontSizes[size as ThemeFontSize<ThemeExtension>] || []

    if (typeof(fontSize) == "number") {
        return [{
            "font-family": `${fontFamily}`,
            "font-size": `${fontSize}px`,
            "font-weight": `${weight}`
        }]
    }
    
    return fontSize.map(size => ({
        "font-family": `${fontFamily}`,
        "font-size": `${size}px`,
        "font-weight": `${weight}`
    }))
}

export const injectFont = <T extends Font<ThemeExtension> & ThemeObject<ThemeExtension>>(props: T, font: ThemeFont<ThemeExtension>) => matchFontToTheme(props, font)

export const injectFonts: InjectProperties<Font<ThemeExtension>> = (props, defaultProps) => {
    const font = (props.font || defaultProps?.font) && matchFontToTheme(props, (props.font || defaultProps?.font)!)

    if (font) return props.theme.breakpoints.map((_, i) => ({
        ...(font[i] && { ...font[i] })
    }))

    return []
}