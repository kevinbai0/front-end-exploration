export const colors = {
    primary: "#E631E9",
    action: "#129AEC",
    foreground: "#131313",
    background: "#FFFFFF",
    greys: [
        "#FFFFFF",
        "#C1C1C1",
        "#AAAAAA",
        "#888888",
        "#333333",
        "#131313",
        "#000000"
    ]
}

const fontFamily = {
    mainFont: 'Arial'
}

const fontSizes = {
    title: 32,
    body: 16,
    bigBody: 18,
    header: 32
}

const fonts = {
    header: {
        family: "mainFont",
        size: "header",
        weight: 900
    },
    body: {
        family: "mainFont",
        size: "body",
        weight: 400
    },
    bigBody: {
        family: "mainFont",
        size: "bigBody",
        weight: 400
    }
}

const shadows = {
    default: `
        shadow-opacity: 0.2;
        shadow-color: black;
        shadow-offset: 0 3px;
        shadow-radius: 8px;
        elevation: 3;
    `
}

const space = [0, 5, 10, 15, 20, 25, 30, 35, 40];

const borderRadius = {
    none: 0, 
    small: 3,
    default: 5, 
    big: 10
}

const borders = {
    ghost: "1px solid foreground"
}

export const defaultTheme = {
    colors, 
    fonts, 
    fontFamily, 
    fontSizes, 
    space, 
    borderRadius, 
    shadows, 
    borders
}

export const createTheme = <NewTheme>(props: NewTheme) => {
    return extendTheme(props);
}

const extendTheme = <T extends Partial<Theme<T>>>(themeOptions: T): Theme<T> => ({
    colors: {
        ...defaultTheme.colors,
        ...themeOptions.colors
    },
    space: {
        ...defaultTheme.space,
        ...themeOptions.space
    },
    fontFamily: {
        ...defaultTheme.fontFamily,
        ...themeOptions.fontFamily
    },
    fontSizes: {
        ...defaultTheme.fontSizes,
        ...themeOptions.fontSizes
    },
    fonts: {
        ...defaultTheme.fonts,
        ...themeOptions.fonts
    },
    borderRadius: {
        ...defaultTheme.borderRadius,
        ...themeOptions.borderRadius
    },
    borders: {
        ...defaultTheme.borders,
        ...themeOptions.borders
    },
    shadows: {
        ...defaultTheme.shadows,
        ...themeOptions.fontFamily
    },
    ...themeOptions
})


export interface ThemeExtension {

}

export type Theme<T> = typeof defaultTheme & T

export type ThemeColor<T> = keyof Theme<T>["colors"]
export type ThemeFont<T> = keyof Theme<T>["fonts"]
export type ThemeFontFamily<T> = keyof Theme<T>["fontFamily"]
export type ThemeFontSize<T> = keyof Theme<T>["fontSizes"]
export type ThemeBorderRadius<T> = keyof Theme<T>["borderRadius"]
export type ThemeBorder<T> = keyof Theme<T>["borders"]

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;