import { TokenType, PartialToken, SubLexer } from "./lexerDefinitions"
import { lexers } from "./sublexers"
import { Transform, TransformCallback } from "stream"

type TokenState = {
    parser: SubLexer | null
    token?: TokenType
    lineNumber: number
    position: number
    tokenComputeState: unknown
}

export default class Lexer extends Transform {
    private state: TokenState = {
        parser: null,
        token: undefined,
        lineNumber: 1,
        position: -1,
        tokenComputeState: undefined
    }

    constructor() {
        super({
            readableObjectMode: true,
            writableObjectMode: false,
            readableHighWaterMark: 1,
            writableHighWaterMark: 1
        })
    }

    private _refeedChar = (char: string, charCode: number) => {
        this.state.token = undefined
        this.state.parser = null

        this._handlePartialToken(this._beginTokenization(char), char, charCode)
    }

    private _handlePartialToken = (token: PartialToken | null, char: string, charCode: number) => {
        if (!token) return
        if (!token.complete) {
            this.state.token = token.token
            return
        }
        this.state.token = undefined
        if (token.token.type == "comment") return
        this.push(token.token)
        if (token.unget) {
            this.readChar(char, charCode, true)
        }
    }

    _transform(chunk: Buffer, _: string, callback: TransformCallback) {
        const value = chunk.toString("utf-8")
        this.readChar(value, value.charCodeAt(0))
        callback()
    }

    private readChar = (char: string, charCode: number, refeed = false) => {
        if (!refeed) {
            this.state.position += 1
            if (char == "\n") {
                this.state.lineNumber += 1
                this.state.position = -1
            }
        }

        if (!this.state.token) {
            this._refeedChar(char, charCode)
            return
        }

        this._handlePartialToken(
            this.state.parser!.tokenizeNext!(
                char,
                this.state.token,
                this.state.lineNumber,
                this.state.position
            ),
            char,
            charCode
        )
    }

    _flush() {
        this.push({
            type: "eof",
            value: "",
            length: 0,
            lineNumber: this.state.lineNumber,
            position: this.state.position
        })
    }

    private _beginTokenization = (char: string): PartialToken | null => {
        const match = lexers.find(val => char.match(val.exp))
        if (!match?.id)
            throw new Error(
                `Unexpected token "${char}" with type "${match?.id}" on line ${this.state.lineNumber}:${this.state.position}`
            )

        this.state.parser = match
        return match?.tokenizeFirst(char, this.state.lineNumber, this.state.position)
    }
}
