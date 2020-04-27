import { TokenType } from "../lexer/lexerDefinitions"
import { Parser } from "./parserDefinitions"
import { createRootParser } from "./parsers"

export function parse(tokens: TokenType[]) {
    const parser: Parser<ProgramAST> = createRootParser()

    for (const token of tokens) {
        parser.receiveToken(token)
        console.log(parser.ast)
    }
}
