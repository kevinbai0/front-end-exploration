export type Marker = "@component" | "@override" | "@export"
export type ReservedKeywordType = "true" | "false" | "cond" | "let"

export const markers: Marker[] = ["@component", "@override", "@export"]
export const reservedKeywords: ReservedKeywordType[] = ["true", "false"]
