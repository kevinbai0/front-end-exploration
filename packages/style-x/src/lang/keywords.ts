export type Marker = "@component" | "@override"
export type ReservedKeywordType = "true" | "false" | "cond" | "let"

export const markers: Marker[] = ["@component", "@override"]
export const reservedKeywords: ReservedKeywordType[] = ["true", "false"]
