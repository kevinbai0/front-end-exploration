import { Parser, HandleTokenMethod } from "../parserDefinitions"
import { ExpectHandlerMarkerAST } from "../definitions"
import { ObjectParser } from "./valueParsers"
import { unexpectedToken } from "./rootParser"

export class ExpectHandleMarkerParser extends Parser<ExpectHandlerMarkerAST> {
    constructor(name: "expects_marker_literal" | "handlers_marker_literal") {
        super("parse_root_expects", {
            id: name
        })
    }
    handleToken: HandleTokenMethod<ExpectHandlerMarkerAST> = (token, ast) => {
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
