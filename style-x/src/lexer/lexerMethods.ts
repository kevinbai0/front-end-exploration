import { PartialToken, TokenTypes, TokenType } from "./lexerDefinitions"

export const tokenizeCharacter = (type: TokenTypes, value: string, lineNumber: number, position: number): PartialToken => ({
    token: {
        type,
        lineNumber,
        position,
        length: 1,
        value
    },
    complete: true,
    unget: false
})

export const tokenizeIncompleteCharacter = (type: TokenTypes, value: string, lineNumber: number, position: number): PartialToken => ({
    token: {
        type,
        lineNumber,
        position,
        length: 1,
        value
    },
    complete: false,
    unget: false
})

export const retokenizeToken = (type: TokenTypes, token: TokenType, newValue: string, options: { complete: boolean; unget?: boolean }): PartialToken => ({
    token: {
        ...token,
        type,
        length: newValue.length,
        value: newValue
    },
    complete: options.complete,
    unget: options.unget || false
})
