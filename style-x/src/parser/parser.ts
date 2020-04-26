import { TokenType } from "../lexer/lexerDefinitions"

type StreamReturn = {
    value: TokenType
    next: () => StreamReturn | null
}

type Stream = (current: TokenType, next: number) => StreamReturn

function createTokenStream(tokens: TokenType[]) {
    const _stream: Stream = (current: TokenType, next: number) => ({
        value: current,
        next: () => {
            if (next >= tokens.length) return null
            return _stream(tokens[next], next + 1)
        }
    })
    return () => _stream(tokens[0], 1)
}

export function getExpectsEnvironment(tokens: TokenType[]) {
    const tokStream = createTokenStream(tokens)

    function recurseStream(curr: StreamReturn | null, ast: AST): null {
        if (!curr) return null
        console.log(curr.value)
        return recurseStream(curr.next(), ast)
    }

    recurseStream(tokStream(), null)
}
