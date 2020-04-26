import { TokenType, PartialToken, Parser } from "./tokenizer_definitions"
import { parsers } from "./parsers"

export const isNumeric = (char: number) => "0".charCodeAt(0) <= char && char <= "9".charCodeAt(0)
export const isAlphabetic = (char: number) =>
    ("a".charCodeAt(0) <= char && char <= "z".charCodeAt(0)) || ("A".charCodeAt(0) <= char && char <= "Z".charCodeAt(0)) || char == "_".charCodeAt(0)
export const isAlphaNumeric = (char: number) => isNumeric(char) || isAlphabetic(char)

type TokenState = {
    parser: Parser | null
    token?: TokenType
    lineNumber: number
    position: number
    tokenComputeState: unknown
}

export default class Tokenizer {
    private state: TokenState = {
        parser: null,
        token: undefined,
        lineNumber: 1,
        position: -1,
        tokenComputeState: undefined
    }

    private _sourceCode = ""

    tokens: TokenType[] = []

    private _refeedChar = (char: string, charCode: number) => {
        this.state.token = undefined
        this.state.parser = null

        this._handlePartialToken(this._beginTokenization(char, charCode), char, charCode)
    }

    private _handlePartialToken = (token: PartialToken | null, char: string, charCode: number) => {
        if (!token) return
        if (!token.complete) {
            this.state.token = token.token
            return
        }
        this.tokens.push(token.token)
        this.state.token = undefined
        if (token.unget) {
            this.readChar(char, charCode, true)
        }
    }

    readChar = (char: string, charCode: number, refeed = false) => {
        if (!refeed) {
            this.state.position += 1
            this._sourceCode += char
            if (char == "\n") {
                this.state.lineNumber += 1
                this.state.position = -1
            }
        }

        if (!this.state.token) {
            this._refeedChar(char, charCode)
            return
        }

        this._handlePartialToken(this.state.parser!.parseNext!(char, this.state.token, this.state.lineNumber, this.state.position), char, charCode)
    }

    private _beginTokenization = (char: string, charCode: number): PartialToken | null => {
        const match = parsers.find(val => char.match(val.exp))
        if (!match?.id) throw new Error(`Unexpected token "${char}" with type "${match?.id}" on line ${this.state.lineNumber}:${this.state.position}`)

        this.state.parser = match
        return match?.parseFirst(char, this.state.lineNumber, this.state.position)
    }
}
