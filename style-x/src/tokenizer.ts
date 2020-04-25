export const isNumeric = (char: number) => "0".charCodeAt(0) <= char && char <= "9".charCodeAt(0)
export const isAlphabetic = (char: number) =>
    ("a".charCodeAt(0) <= char && char <= "z".charCodeAt(0)) || ("A".charCodeAt(0) <= char && char <= "Z".charCodeAt(0))
export const isAlphaNumeric = (char: number) => isNumeric(char) || isAlphabetic(char)

type Marker = "@expects" | "@handlers" | "@component"
type PrimitiveType = "string" | "number" | "any" | "object" | "undefined" | "null" | "void"

export const markers: Marker[] = ["@expects", "@handlers", "@component"]
export const primitiveTypes: PrimitiveType[] = ["string", "number", "any", "object", "undefined", "null"]
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
          value: Marker
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

export const tokenizeOpenParen = (lineNumber: number, position: number): TokenType => ({
    type: "paren",
    lineNumber,
    position,
    length: 1,
    value: "("
})

export const tokenizeCloseParen = (lineNumber: number, position: number): TokenType => ({
    type: "paren",
    lineNumber,
    position,
    length: 1,
    value: ")"
})

export const tokenizeOpenCurlyBrace = (lineNumber: number, position: number): TokenType => ({
    type: "curly_brace",
    lineNumber,
    position,
    length: 1,
    value: "{"
})

export const tokenizeCloseCurlyBrace = (lineNumber: number, position: number): TokenType => ({
    type: "curly_brace",
    lineNumber,
    position,
    length: 1,
    value: "}"
})

export const tokenizeOpenSquareBrace = (lineNumber: number, position: number): TokenType => ({
    type: "square_brace",
    lineNumber,
    position,
    length: 1,
    value: "["
})

export const tokenizeCloseSquareBrace = (lineNumber: number, position: number): TokenType => ({
    type: "square_brace",
    lineNumber,
    position,
    length: 1,
    value: "]"
})

export const tokenizeColon = (lineNumber: number, position: number): TokenType => ({
    type: "colon",
    lineNumber,
    position,
    length: 1,
    value: ":"
})

export const tokenizeQuestionMark = (lineNumber: number, position: number): TokenType => ({
    type: "questionMark",
    lineNumber,
    position,
    length: 1,
    value: "?"
})

export const tokenizeDot = (lineNumber: number, position: number): TokenType => ({
    type: "dot",
    lineNumber,
    position,
    length: 1,
    value: "."
})

export const tokenizeWithEqual = (str: string, lineNumber: number, position: number): TokenType => {
    if (str[position + 1] && str[position + 1] == ">")
        return {
            type: "arrow",
            lineNumber,
            position,
            length: 2,
            value: "=>"
        }
    if (str[position + 1] && str[position + 1] == "=")
        return {
            type: "arrow",
            lineNumber,
            position,
            length: 2,
            value: "=>"
        }
    return {
        type: "equal",
        lineNumber,
        position,
        length: 1,
        value: "="
    }
}

export const tokenizeNumber = (str: string, lineNumber: number, position: number): TokenType => {
    let returnStr = ""
    let decimalFound = false
    for (let i = position; i < str.length; ++i) {
        if (decimalFound && str.charAt(i) == ".") throw new Error(`Unexpected token "." ${lineNumber}:${position + i}`)
        if (i == str.length - 1 && str.charAt(i) == ".") throw new Error(`Unexpected token "." ${lineNumber}:${position + i}`)
        if (str.charAt(i) == ".") {
            returnStr += str.charAt(i)
            decimalFound = true
        }
        if (isNumeric(str.charCodeAt(i))) {
            returnStr += i
        } else {
            return {
                type: "number",
                lineNumber,
                position,
                length: returnStr.length,
                value: returnStr
            }
        }
    }

    return {
        type: "number",
        lineNumber,
        position,
        length: returnStr.length,
        value: returnStr
    }
}

export const tokenizeIdentifier = (str: string, lineNumber: number, position: number): TokenType => {
    let returnStr = str[position]
    function returnTokenType(str: string): TokenType {
        const primitive = primitiveTypes.find(type => type == str)
        if (primitive)
            return {
                type: "primitive_type",
                lineNumber,
                position,
                length: primitive.length,
                value: primitive
            }
        return {
            type: "identifier",
            lineNumber,
            position,
            length: returnStr.length,
            value: returnStr
        }
    }
    for (let i = position + 1; i < str.length; ++i) {
        if (!isAlphaNumeric(str.charCodeAt(i))) {
            return returnTokenType(returnStr)
        }

        returnStr += str.charAt(i)
    }

    // TODO: Handle partial string
    return returnTokenType(returnStr)
}

export const tokenizeMarker = (str: string, lineNumber: number, position: number): TokenType => {
    let returnStr = "@"
    let possibilities = markers.map(value => value)
    for (let i = position + 1; i < str.length; ++i) {
        returnStr += str.charAt(i)
        // eslint-disable-next-line no-loop-func
        const res = possibilities.find(value => value == returnStr)
        if (res) {
            return {
                type: "marker",
                lineNumber,
                position,
                length: res.length,
                value: res
            }
        }
        // eslint-disable-next-line no-loop-func
        possibilities = possibilities.filter(possibility => possibility.startsWith(returnStr))
        if (possibilities.length == 0) throw new Error(`Unexpected marker ${returnStr} on line ${lineNumber}:${position}`)
    }
    throw new Error(`Unexpected marker ${returnStr} on line ${lineNumber}:${position}`)
}

export const tokenizeString = (str: string, lineNumber: number, position: number): TokenType => {
    let returnStr = str.charAt(position)
    for (let i = position + 1; i < str.length; ++i) {
        returnStr += str.charAt(i)
        if (str.charAt(i) == "`")
            return {
                type: "string",
                lineNumber,
                position,
                length: returnStr.length,
                value: returnStr
            }
    }

    // TODO: Handle partial string
    return {
        type: "string",
        lineNumber,
        position,
        length: returnStr.length,
        value: returnStr
    }
}

export const tokenizeForwardSlash = (str: string, lineNumber: number, position: number): TokenType => {
    if (str[position + 1] && str[position + 1] == "/")
        return {
            type: "comment",
            lineNumber,
            position,
            length: 2,
            value: "//"
        }
    else if (str[position + 1] && str[position + 1] == "*") {
        let returnStr = ""
        for (let i = position + 2; i < str.length - 1; ++i) {
            returnStr += str[i]
            if (str.slice(i, i + 2) == "*/") {
                returnStr += str[i + 1]
                return {
                    type: "comment",
                    lineNumber,
                    position,
                    length: returnStr.length,
                    value: returnStr
                }
            }
        }
    }
    throw new Error(`Unexpected token / on line ${lineNumber}:${position}`)
}
