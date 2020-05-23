import { Parser, ParseType, HandleTokenMethod } from "../parserDefinitions"
import { TokenType } from "../../lexer/lexerDefinitions"
import { ImportExpressionParser } from "./importParsers"
import { ProgramAST, KeyValueExpressionAST } from "../../lang/definitions"
import { ValueParser, KeyValueExpressionParser } from "./valueParsers"

export function unexpectedToken(token: TokenType, parser: ParseType) {
    return new Error(
        `Unexpected token "${token.value}" on line ${token.lineNumber}:${token.position} in ${parser}`
    )
}

export class RootParser extends Parser<ProgramAST> {
    constructor() {
        super("parse_root_program", {
            id: "program",
            definitions: [],
            imports: [],
            exports: []
        })
    }

    protected handleToken: HandleTokenMethod<ProgramAST> = (token, ast) => {
        switch (token.value) {
            case "import":
                return this.setDelegate(new ImportExpressionParser(token), completedAst => {
                    this.setAst({
                        ...ast,
                        imports: [...ast.imports, completedAst]
                    })
                })
            case "@override":
                return this.setDelegate(new LetStatementParser(), exprAst => {
                    this.setAst({
                        ...ast,
                        definitions: [...ast.definitions, exprAst]
                    })
                })
            case "@export":
                return this.setDelegate(new LetStatementParser(), exprAst => {
                    this.setAst({
                        ...ast,
                        exports: [...ast.exports, exprAst]
                    })
                })
            case "let":
                return this.setDelegate(
                    new KeyValueExpressionParser({ overridable: false }),
                    exprAst => {
                        this.setAst({
                            ...ast,
                            definitions: [...ast.definitions, exprAst]
                        })
                    }
                )
            case "@component":
                return this.setDelegate(new ValueParser(), newAst => {
                    this.setAst({
                        ...ast,
                        component: {
                            id: "component_marker_literal",
                            value: newAst
                        }
                    })
                })
            default:
                if (token.type == "eof") return this.endParser()
                throw unexpectedToken(token, this.id)
        }
    }
}

class LetStatementParser extends Parser<KeyValueExpressionAST> {
    constructor() {
        super("parse_let_expresion", {
            id: "key_value",
            identifier: ""
        })
    }

    handleToken: HandleTokenMethod<KeyValueExpressionAST> = (token, ast) => {
        if (token.value == "let" && !ast.value) {
            return this.setDelegate(
                new KeyValueExpressionParser({ overridable: true }),
                (exprAst, refeed) => {
                    this.setAst(exprAst)
                    this.endParser({ refeed })
                }
            )
        }
        throw unexpectedToken(token, this.id)
    }
}
