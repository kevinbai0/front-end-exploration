import { ThemeFont, ThemeExtension, ThemeFontFamily, ThemeObject, ThemeFontSize, Font } from "../theme/index.d"

const matchFontToTheme = <T extends Font<ThemeExtension> & ThemeObject<ThemeExtension>>(props: T, prop: ThemeFont<ThemeExtension>) => {
    if (!props.theme.fonts[prop]) return "";
    const { family, size, weight } = props.theme.fonts[prop]
    const fontFamily = props.theme.fontFamily[family as ThemeFontFamily<ThemeExtension>] || family
    const fontSize = props.theme.fontSizes[size as ThemeFontSize<ThemeExtension>] || size
    
    return `
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        font-weight: ${weight};
    `
}

export const injectFont = <T extends Font<ThemeExtension> & ThemeObject<ThemeExtension>>(props: T, font: ThemeFont<ThemeExtension>) => matchFontToTheme(props, font)

export const injectFonts = <T extends Font<ThemeExtension> & ThemeObject<ThemeExtension>>(props: T) => `
    ${props.font ? `${matchFontToTheme(props, props.font)};` : ""}
`