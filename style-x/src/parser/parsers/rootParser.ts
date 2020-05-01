import { Parser, ParseType } from "../parserDefinitions"
import { TokenType } from "../../lexer/lexerDefinitions"
import { ImportExpressionParser } from "./importParsers"
import { ProgramAST } from "../definitions"
import { ExpressionParser } from "./valueParsers"

export function unexpectedToken(token: TokenType, parser: ParseType) {
    return new Error(`Unexpected token "${token.value}" on line ${token.lineNumber}:${token.position} in ${parser}`)
}

export class RootParser extends Parser<ProgramAST> {
    constructor() {
        super("parse_root_program", {
            id: "program",
            definitions: [],
            imports: []
        })
    }

    protected handleToken = (token: TokenType, ast: ProgramAST) => {
        switch (token.value) {
            case "import":
                return this.setDelegate(new ImportExpressionParser(token), completedAst => {
                    this.setAst({
                        ...ast,
                        imports: [...ast.imports, completedAst]
                    })
                })
            case "let":
                return this.setDelegate(new ExpressionParser(), exprAst => {
                    this.setAst({
                        ...ast,
                        definitions: [...ast.definitions, exprAst]
                    })
                })
            default:
                console.log(ast.definitions)
                throw unexpectedToken(token, this.id)
        }
    }
}
