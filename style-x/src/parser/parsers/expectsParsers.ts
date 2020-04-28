import { Parser, HandleTokenMethod } from "../parserDefinitions"
import { ExpectsMarkerAST } from "../definitions"
import { ObjectParser } from "./valueParsers"
import { unexpectedToken } from "./rootParser"

export class ExpectsMarkerParser extends Parser<ExpectsMarkerAST> {
    constructor() {
        super("parse_root_expects", {
            id: "expects_marker_literal"
        })
    }
    handleToken: HandleTokenMethod<ExpectsMarkerAST> = (token, ast) => {
        if (token.type == "curly_brace") {
            if (!ast.value && token.value == "{") {
                return this.setDelegate(new ObjectParser(), objAst => {
                    this.setAst({
                        ...ast,
                        value: objAst
                    })
                    this.endParser()
                })
            }
        }
        throw unexpectedToken(token)
    }
}
