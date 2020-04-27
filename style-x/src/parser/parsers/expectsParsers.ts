import { Parser } from "../parserDefinitions"
import { ExpectsMarkerAST, ExpressionAST } from "../definitions"
import { TokenType } from "../../lexer/lexerDefinitions"

export class ExpectsMarkerParser extends Parser<ExpectsMarkerAST> {
    constructor() {
        super("root_expects", {
            id: "expects_marker_literal",
            value: []
        })
    }
    handleToken = (token: TokenType, ast: ExpectsMarkerAST) => {
        if (token.type == "curly_brace") {
            if (ast.value.length && token.value == "}") return { complete: true }
            if (!ast.value.length && token.value == "{") {
                this.setDelegate(new ExpressionParser(), exprAst => {
                    this.setAst({
                        ...ast,
                        value: [...ast.value, exprAst]
                    })
                })
                return { complete: false }
            }
        }
        return { complete: false }
    }
}

export class ExpressionParser extends Parser<ExpressionAST> {
    constructor() {
        super("expression", {
            id: "expression",
            identifier: ""
        })
    }

    handleToken = (token: TokenType, ast: ExpressionAST) => {
        if (token.type == "identifier" && !ast.identifier) {
            this.setAst({
                ...ast,
                identifier: token.value
            })
            return { complete: false }
        }
        return { complete: false }
    }
}
