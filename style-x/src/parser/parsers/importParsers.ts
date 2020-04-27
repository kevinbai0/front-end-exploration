import { unexpectedToken } from "./rootParser"
import { Parser } from "../parserDefinitions"
import { TokenType } from "../../lexer/lexerDefinitions"
import { ImportMarkerAST, ModuleAST } from "../definitions"

/**
 * Expects { module, module, module }
 */
export class ImportMarkerParser extends Parser<ImportMarkerAST> {
    constructor() {
        super("root_import", {
            id: "import_marker_literal",
            value: []
        })
    }

    handleToken = (token: TokenType, ast: ImportMarkerAST) => {
        if (token.type != "curly_brace") throw unexpectedToken(token)
        if (token.value == "}" && ast == null) throw unexpectedToken(token)

        if (token.value == "{") {
            this.setDelegate(new ModuleParser(), moduleAst => {
                this.setAst({
                    ...(ast as ImportMarkerAST),
                    value: [...(ast as ImportMarkerAST).value, moduleAst as ModuleAST]
                })
            })
            return { complete: false }
        }
        // assumes } token is received
        return { complete: true }
    }
}

export class ModuleParser extends Parser<ModuleAST> {
    constructor() {
        super("module", {
            id: "module_literal",
            value: ""
        })
    }

    handleToken = (token: TokenType, ast: ModuleAST) => {
        if (!ast.value && token.type == "identifier") {
            this.setAst({
                id: "module_literal",
                value: token.value
            })
            return { complete: false }
        }
        if (ast.value && token.type == "break") return { complete: true }
        if (ast.value && token.type == "curly_brace" && token.value == "}") return { complete: true, unget: true }
        throw unexpectedToken(token)
    }
}
