import { unexpectedToken } from "./rootParser"
import { Parser } from "../parserDefinitions"
import { TokenType } from "../../lexer/lexerDefinitions"
import { ImportMarkerAST, ModuleAST } from "../definitions"

/**
 * Expects { module, module, module }
 */
export class ImportMarkerParser extends Parser<ImportMarkerAST> {
    constructor() {
        super("parse_root_import", {
            id: "import_marker_literal",
            value: []
        })
    }

    handleToken = (token: TokenType, ast: ImportMarkerAST) => {
        if (token.type != "curly_brace") throw unexpectedToken(token)
        if (token.value == "}" && ast == null) throw unexpectedToken(token)

        if (token.value == "{") {
            return this.setDelegate(new ModuleParser(), moduleAst => {
                this.setAst({
                    ...(ast as ImportMarkerAST),
                    value: [...(ast as ImportMarkerAST).value, moduleAst as ModuleAST]
                })
            })
        }
        // assumes } token is received
        return this.endParser()
    }
}

export class ModuleParser extends Parser<ModuleAST> {
    constructor() {
        super("parse_module", {
            id: "module_literal",
            value: ""
        })
    }

    handleToken = (token: TokenType, ast: ModuleAST) => {
        if (!ast.value && token.type == "identifier") {
            return this.setAst({
                id: "module_literal",
                value: token.value
            })
        }
        if (ast.value && token.type == "break") return this.endParser()
        if (ast.value && token.type == "curly_brace" && token.value == "}") return this.endParser({ unget: true })
        throw unexpectedToken(token)
    }
}
