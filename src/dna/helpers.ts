import { ThemeProperties, DNA, ThemeObject } from "../theme/index.d"

export type MatchFunction<T, K> = <S extends K & ThemeObject>(props: S, prop: T) => string[]

export const splitStyle = <T extends ThemeProperties>(
    key: keyof DNA,
    cssName: string[],
    method: (props: DNA & ThemeObject, prop: any) => string[],
    props: DNA & ThemeObject, 
    defaultProps?: Partial<DNA>
): {
    property: string[],
    value: string[]
} | undefined => {
    const value = props[key] ?? (defaultProps && defaultProps[key])
    if (typeof(value) != "undefined") return {
        property: cssName,
        value: method(props, value as T)
    }
}