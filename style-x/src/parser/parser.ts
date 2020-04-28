import { TokenType } from "../lexer/lexerDefinitions"
import { RootParser } from "./parsers/rootParser"

export function parse(tokens: TokenType[]) {
    const parser = new RootParser()

    for (const token of tokens) {
        parser.receiveToken(token)
    }
}
