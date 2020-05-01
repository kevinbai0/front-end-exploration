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
    | "conditional"
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
    | "eof"

export type TokenizeTypes =
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
    | "parseConditional"

export type PartialToken = {
    token: TokenType
    complete: boolean
    unget: boolean
}

/** Define parsers */

export type TokenizeValue = (char: string, lineNumber: number, position: number) => PartialToken | null
export type TokenizeNextValue = (char: string, token: TokenType, lineNumber: number, position: number) => PartialToken | null

export interface SubLexer {
    type: "primitive" | "stateful"
    id: TokenizeTypes
    exp: RegExp
    tokenizeFirst: TokenizeValue
    tokenizeNext?: TokenizeNextValue
}

export interface PrimitiveSubLexer extends SubLexer {
    type: "primitive"
}

export interface StatefulSubLexer<T> extends SubLexer {
    type: "stateful"
    state: T
}

export function createSubLexer(
    id: TokenizeTypes,
    exp: RegExp,
    methods: {
        tokenizeFirst: TokenizeValue
        tokenizeNext?: TokenizeNextValue
    }
): PrimitiveSubLexer {
    return {
        type: "primitive",
        id,
        exp: exp,
        tokenizeFirst: methods.tokenizeFirst,
        tokenizeNext: methods.tokenizeNext
    }
}

export function createStatefulLexer<T>(
    id: TokenizeTypes,
    exp: RegExp,
    methods: {
        tokenizeFirst: TokenizeValue
        tokenizeNext?: TokenizeNextValue
    },
    defaultState: T
): StatefulSubLexer<T> {
    return {
        type: "stateful",
        id,
        exp: exp,
        tokenizeFirst: methods.tokenizeFirst,
        tokenizeNext: methods.tokenizeNext,
        state: defaultState
    }
}
