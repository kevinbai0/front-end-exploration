export const isNumeric = (char: number) => "0".charCodeAt(0) <= char && char <= "9".charCodeAt(0)
export const isAlphabetic = (char: number) =>
    ("a".charCodeAt(0) <= char && char <= "z".charCodeAt(0)) || ("A".charCodeAt(0) <= char && char <= "Z".charCodeAt(0))
export const isAlphaNumeric = (char: number) => isNumeric(char) || isAlphabetic(char)

type Marker = "@expects" | "@handlers" | "@component"
type PrimitiveType = "string" | "number" | "any" | "object" | "undefined" | "null" | "void"

export const markers: Marker[] = ["@expects", "@handlers", "@component"]
export const primitiveTypes: PrimitiveType[] = ["string", "number", "any", "object", "undefined", "null", "void"]
export type TokenType =
    | {
          type: "paren"
          lineNumber: number
          position: number
          length: 1
          value: "(" | ")"
      }
    | {
          type: "curly_brace"
          lineNumber: number
          position: number
          length: 1
          value: "{" | "}"
      }
    | {
          type: "square_brace"
          lineNumber: number
          position: number
          length: 1
          value: "[" | "]"
      }
    | {
          type: "dot"
          lineNumber: number
          position: number
          length: 1
          value: "."
      }
    | {
          type: "comment"
          lineNumber: number
          position: number
          length: number
          value: string
      }
    | {
          type: "number"
          lineNumber: number
          position: number
          length: number
          value: string
      }
    | {
          type: "string"
          lineNumber: number
          position: number
          length: number
          value: string
      }
    | {
          type: "identifier"
          lineNumber: number
          position: number
          length: number
          value: string
      }
    | {
          type: "marker"
          lineNumber: number
          position: number
          length: number
          value: string
      }
    | {
          type: "reserved_keyword"
          lineNumber: number
          position: number
          length: number
          value: "const"
      }
    | {
          type: "comparator"
          lineNumber: number
          position: number
          length: 1 | 2
          value: "==" | "&&" | "||" | "<" | ">" | "<=" | ">="
      }
    | {
          type: "equal"
          lineNumber: number
          position: number
          length: 1
          value: "="
      }
    | {
          type: "arrow"
          lineNumber: number
          position: number
          length: 2
          value: "=>"
      }
    | {
          type: "colon"
          lineNumber: number
          position: number
          length: 1
          value: ":"
      }
    | {
          type: "questionMark"
          lineNumber: number
          position: number
          length: 1
          value: "?"
      }
    | {
          type: "primitive_type"
          lineNumber: number
          position: number
          length: number
          value: PrimitiveType
      }

type TokenState = {
    token?: TokenType
    lineNumber: number
    position: number
    tokenComputeState: unknown
}

type PartialToken = {
    token: TokenType
    complete: boolean
    unget?: boolean
}

type MarkerTokenComputeState = typeof markers

export default class Tokenizer {
    private state: TokenState = {
        token: undefined,
        lineNumber: 1,
        position: -1,
        tokenComputeState: undefined
    }

    tokens: TokenType[] = []

    private _refeedChar = (char: string, charCode: number) => {
        this.state.token = undefined

        this._handlePartialToken(this._beginTokenization(char, charCode), char, charCode)
    }

    private _handlePartialToken = (token: PartialToken | undefined, char: string, charCode: number) => {
        if (!token) return
        if (!token.complete) {
            this.state.token = token.token
            return
        }
        this.tokens.push(token.token)
        this.state.token = undefined
        if (token.unget) {
            this.readChar(char, charCode)
        }
    }

    readChar = (char: string, charCode: number) => {
        this.state.position += 1
        if (char == "\n") {
            this.state.lineNumber += 1
            this.state.position = -1
        }

        if (!this.state.token) {
            this._refeedChar(char, charCode)
            return
        }

        const midTokenization = (type: TokenType["type"]): PartialToken => {
            if (type == "comment") return this.tokenizeForwardSlash(char)
            else if (type == "marker") return this.tokenizeMarker(char, charCode)
            else if (type == "equal") return this.tokenizeWithEqual(char, charCode)
            else if (type == "string") return this.tokenizeString(char)
            else if (type == "number") return this.tokenizeNumber(char, charCode)
            else if (type == "identifier") return this.tokenizeIdentifier(char, charCode)
            throw new Error(`Unexpected type "${type}" during mid tokenization on line ${this.state.lineNumber}:${this.state.position}`)
        }

        this._handlePartialToken(midTokenization(this.state.token.type), char, charCode)
    }

    private _beginTokenization = (char: string, charCode: number): PartialToken | undefined => {
        if (char == "/") return this.tokenizeForwardSlash(char)
        if (char == "@") return this.tokenizeMarker(char, charCode)
        if (char == "(") return this.tokenizeOpenParen()
        if (char == ")") return this.tokenizeCloseParen()
        if (char == "{") return this.tokenizeOpenCurlyBrace()
        if (char == "}") return this.tokenizeCloseCurlyBrace()
        if (char == "[") return this.tokenizeOpenSquareBrace()
        if (char == "]") return this.tokenizeCloseSquareBrace()
        if (char == "=") return this.tokenizeWithEqual(char, charCode)
        if (char == ".") return this.tokenizeDot()
        if (char == ":") return this.tokenizeColon()
        if (char == "`") return this.tokenizeString(char)
        if (char == "?") return this.tokenizeQuestionMark()
        if (isNumeric(charCode)) return this.tokenizeNumber(char, charCode)
        if (isAlphabetic(charCode)) return this.tokenizeIdentifier(char, charCode)
        // skip white space and new lines
        if (char == " ") return
        if (char == "\n") return
        throw new Error(`Unrecognized token "${char}" on line ${this.state.lineNumber}:${this.state.position}`)
    }

    // Tokenize methods
    private tokenizeOpenParen = (): PartialToken => ({
        token: {
            type: "paren",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: "("
        },
        complete: true
    })

    private tokenizeCloseParen = (): PartialToken => ({
        token: {
            type: "paren",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: ")"
        },
        complete: true
    })

    private tokenizeOpenCurlyBrace = (): PartialToken => ({
        token: {
            type: "curly_brace",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: "{"
        },
        complete: true
    })

    private tokenizeCloseCurlyBrace = (): PartialToken => ({
        token: {
            type: "curly_brace",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: "}"
        },
        complete: true
    })

    private tokenizeOpenSquareBrace = (): PartialToken => ({
        token: {
            type: "square_brace",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: "["
        },
        complete: true
    })

    private tokenizeCloseSquareBrace = (): PartialToken => ({
        token: {
            type: "square_brace",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: "]"
        },
        complete: true
    })

    private tokenizeColon = (): PartialToken => ({
        token: {
            type: "colon",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: ":"
        },
        complete: true
    })

    private tokenizeQuestionMark = (): PartialToken => ({
        token: {
            type: "questionMark",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: "?"
        },
        complete: true
    })

    private tokenizeDot = (): PartialToken => ({
        token: {
            type: "dot",
            lineNumber: this.state.lineNumber,
            position: this.state.position,
            length: 1,
            value: "."
        },
        complete: true
    })

    private tokenizeWithEqual = (char: string, charCode: number): PartialToken => {
        if (this.state.token?.type == "equal") {
            if (char == ">") {
                return {
                    token: {
                        type: "arrow",
                        lineNumber: this.state.token.lineNumber,
                        position: this.state.token.position,
                        length: 2,
                        value: "=>"
                    },
                    complete: true
                }
            } else if (char == "=") {
                return {
                    token: {
                        type: "comparator",
                        lineNumber: this.state.token.lineNumber,
                        position: this.state.token.position,
                        length: 2,
                        value: "=="
                    },
                    complete: true
                }
            }
            return {
                token: this.state.token,
                complete: true,
                unget: true
            }
        }

        return {
            token: {
                type: "equal",
                lineNumber: this.state.lineNumber,
                position: this.state.position,
                length: 1,
                value: "="
            },
            complete: false
        }
    }

    private tokenizeNumber = (char: string, charCode: number): PartialToken => {
        const numeric = isNumeric(charCode) || char == "."

        if (this.state.token?.type == "number") {
            return {
                token: {
                    ...this.state.token,
                    ...(numeric && { value: this.state.token.value + char }),
                    ...(numeric && { length: this.state.token.length + 1 })
                },
                complete: numeric,
                unget: !numeric
            }
        }

        if (!numeric)
            throw new Error(`Tried to parse numeric token "${char}" when value isn't a number on line ${this.state.lineNumber}:${this.state.position}`)

        // TODO: Handle decimals better
        return {
            token: {
                type: "number",
                lineNumber: this.state.lineNumber,
                position: this.state.position,
                length: 1,
                value: char
            },
            complete: false
        }
    }

    private tokenizeIdentifier = (char: string, charCode: number): PartialToken => {
        if (this.state.token?.type == "identifier") {
            const alphanum = isAlphaNumeric(charCode)
            if (!alphanum) {
                const primitive = primitiveTypes.find(type => type == this.state.token?.value)
                if (primitive)
                    return {
                        token: {
                            ...this.state.token,
                            type: "primitive_type",
                            value: primitive
                        },
                        complete: true,
                        unget: true
                    }
                return {
                    token: {
                        ...this.state.token
                    },
                    complete: true,
                    unget: true
                }
            }
            return {
                token: {
                    ...this.state.token,
                    length: this.state.token.length + 1,
                    value: this.state.token.value + char
                },
                complete: false
            }
        }

        // token doesn't exist
        return {
            token: {
                type: "identifier",
                lineNumber: this.state.lineNumber,
                position: this.state.position,
                length: 1,
                value: char
            },
            complete: false
        }
    }

    private tokenizeMarker = (char: string, charCode: number): PartialToken => {
        if (this.state.token?.type == "marker") {
            const newTokenValue: TokenType = {
                ...this.state.token,
                length: this.state.token.length + 1,
                value: this.state.token.value + char
            }

            const compState = this.state.tokenComputeState as MarkerTokenComputeState

            // try and find match
            const res = compState.find(value => value == newTokenValue.value)

            this.state.tokenComputeState = compState.filter(value => value.startsWith(newTokenValue.value))
            if ((this.state.tokenComputeState as MarkerTokenComputeState).length == 0) {
                throw new Error(`Unexpected marker ${newTokenValue.value} on line ${newTokenValue.lineNumber}:${newTokenValue.position}`)
            }

            if (res) {
                return {
                    token: {
                        ...this.state.token,
                        length: res.length,
                        value: res
                    },
                    complete: true
                }
            }

            return {
                token: newTokenValue,
                complete: false
            }
        }

        // set the compute state to all the markers
        this.state.tokenComputeState = markers.map(value => value)
        return {
            token: {
                type: "marker",
                lineNumber: this.state.lineNumber,
                position: this.state.position,
                length: 1,
                value: "@"
            },
            complete: false
        }
    }

    private tokenizeString = (char: string): PartialToken => {
        if (this.state.token?.type == "string") {
            return {
                token: {
                    ...this.state.token,
                    length: this.state.token.length + 1,
                    value: this.state.token.value + char
                },
                complete: char == "`"
            }
        }
        return {
            token: {
                type: "string",
                lineNumber: this.state.lineNumber,
                position: this.state.position,
                length: 1,
                value: char
            },
            complete: false
        }
    }

    private tokenizeForwardSlash = (char: string): PartialToken => {
        if (this.state.token?.type == "comment") {
            if (this.state.token.value == "//") {
                // wait until \n then proceed
                if (char != "\n") {
                    return {
                        token: this.state.token,
                        complete: false
                    }
                }
                return {
                    token: this.state.token,
                    complete: true
                }
            } else if (this.state.token.value == "/" && char == "/") {
                return {
                    token: {
                        ...this.state.token,
                        value: "//",
                        length: 2
                    },
                    complete: false
                }
            }
            throw new Error(`Unexpected token / on line ${this.state.token.lineNumber}:${this.state.token.position}`)
        }

        return {
            token: {
                type: "comment",
                lineNumber: this.state.lineNumber,
                position: this.state.position,
                length: 1,
                value: char
            },
            complete: false
        }
    }
}
