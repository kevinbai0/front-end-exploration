export type Marker = "@import" | "@expects" | "@handlers" | "@component"
export type PrimitiveType = "string" | "number" | "any" | "object" | "void"
export type ReservedKeywordType = "true" | "false"

export const markers: Marker[] = ["@import", "@expects", "@handlers", "@component"]
export const primitiveTypes: PrimitiveType[] = ["string", "number", "any", "object", "void"]
export const reservedKeywords: ReservedKeywordType[] = ["true", "false"]
