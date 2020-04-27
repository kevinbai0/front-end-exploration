import { Parser } from "../parserDefinitions"
import { TokenType } from "../../lexer/lexerDefinitions"
import { ImportMarkerParser } from "./importParsers"
import { ProgramAST } from "../definitions"

export function unexpectedToken(token: TokenType) {
    return new Error(`Unexpected token ${token.value} on line ${token.lineNumber}:${token.position}`)
}

export class RootParser extends Parser<ProgramAST> {
    constructor() {
        super("root_program", {
            id: "program"
        })
    }

    protected handleToken = (token: TokenType, ast: ProgramAST) => {
        if (token.type != "marker") throw unexpectedToken(token)
        switch (token.value) {
            case "@import":
                this.setDelegate(new ImportMarkerParser(), completedAst => {
                    this.setAst({
                        id: "program",
                        ...(ast as ProgramAST),
                        imports: completedAst
                    })
                })
                break
            default:
                throw unexpectedToken(token)
        }
        return { complete: false }
    }
}
