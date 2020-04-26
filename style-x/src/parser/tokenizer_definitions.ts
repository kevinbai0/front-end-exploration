export type Marker = "@expects" | "@handlers" | "@component"
export type PrimitiveType = "string" | "number" | "any" | "object" | "undefined" | "null" | "void"

export const markers: Marker[] = ["@expects", "@handlers", "@component"]
export const primitiveTypes: PrimitiveType[] = ["string", "number", "any", "object", "undefined", "null", "void"]
export type TokenType = {
    type: TokenTypes
    lineNumber: number
    position: number
    length: number
    value: string
}

export type TokenTypes =
    | "dot"
    | "comment"
    | "questionMark"
    | "paren"
    | "curly_brace"
    | "square_brace"
    | "colon"
    | "arrow"
    | "break"
    | "comparator"
    | "operator"
    | "equal"
    | "number"
    | "string"
    | "identifier"
    | "reserved_keyword"
    | "primitive_type"
    | "marker"
    | "unknown"

export type ParseTypes =
    | "parseBreakSymbol"
    | "parseDotSymbol"
    | "parseParenSymbol"
    | "parseOperator"
    | "parseQuestionSymbol"
    | "parseColonSymbol"
    | "parseWhitespace"
    | "parseComparator"
    | "parseEqual"
    | "parseIdentifier"
    | "parseString"
    | "parseNumber"
    | "parseMarker"
    | "parseComment"

export type PartialToken = {
    token: TokenType
    complete: boolean
    unget: boolean
}

/** Define parsers */

export type ParseValue = (char: string, lineNumber: number, position: number) => PartialToken | null
export type ParseNextValue = (char: string, token: TokenType, lineNumber: number, position: number) => PartialToken | null

export interface Parser {
    type: "primitive" | "stateful"
    id: ParseTypes
    exp: RegExp
    parseFirst: ParseValue
    parseNext?: ParseNextValue
}

export interface PrimitiveParser extends Parser {
    type: "primitive"
}

export interface StatefulParser<T> extends Parser {
    type: "stateful"
    state: T
}

export function createParser(
    id: ParseTypes,
    exp: RegExp,
    methods: {
        parseFirst: ParseValue
        parseNext?: ParseNextValue
    }
): PrimitiveParser {
    return {
        type: "primitive",
        id,
        exp: exp,
        parseFirst: methods.parseFirst,
        parseNext: methods.parseNext
    }
}

export function createStatefulParser<T>(
    id: ParseTypes,
    exp: RegExp,
    methods: {
        parseFirst: ParseValue
        parseNext?: ParseNextValue
    },
    defaultState: T
): StatefulParser<T> {
    return {
        type: "stateful",
        id,
        exp: exp,
        parseFirst: methods.parseFirst,
        parseNext: methods.parseNext,
        state: defaultState
    }
}
