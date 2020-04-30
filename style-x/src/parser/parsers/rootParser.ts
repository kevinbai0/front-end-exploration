import { Parser } from "../parserDefinitions"
import { TokenType } from "../../lexer/lexerDefinitions"
import { ImportMarkerParser } from "./importParsers"
import { ProgramAST } from "../definitions"
import { ExpectHandleMarkerParser } from "./expectsParsers"

export function unexpectedToken(token: TokenType) {
    return new Error(`Unexpected token "${token.value}" on line ${token.lineNumber}:${token.position}`)
}

export class RootParser extends Parser<ProgramAST> {
    constructor() {
        super("parse_root_program", {
            id: "program"
        })
    }

    protected handleToken = (token: TokenType, ast: ProgramAST) => {
        if (token.type != "marker") throw unexpectedToken(token)
        switch (token.value) {
            case "@import":
                return this.setDelegate(new ImportMarkerParser(), completedAst => {
                    this.setAst({
                        ...ast,
                        imports: completedAst
                    })
                })
            case "@expects":
                return this.setDelegate(new ExpectHandleMarkerParser("expects_marker_literal"), completedAst => {
                    this.setAst({
                        ...ast,
                        expects: completedAst
                    })
                })
            case "@handlers":
                return this.setDelegate(new ExpectHandleMarkerParser("handlers_marker_literal"), completedAst => {
                    this.setAst({
                        ...ast,
                        expects: completedAst
                    })
                })
            default:
                throw unexpectedToken(token)
        }
    }
}
