import { unexpectedToken } from "./rootParser"
import { Parser, HandleTokenMethod } from "../parserDefinitions"
import { TokenType } from "../../lexer/lexerDefinitions"
import { ModuleAST, ImportExpressionAST } from "../../lang/definitions"

/**
 * Expects { module, module, module }
 */
export class ImportExpressionParser extends Parser<ImportExpressionAST> {
    constructor(token: TokenType) {
        super("parse_root_import", {
            id: "import_marker_literal",
            value: [],
            fromModule: { id: "module_literal", value: "" },
            lineNumber: token.lineNumber,
            position: token.position
        })
    }

    isDestructured = false
    isDestructuring = false

    handleToken: HandleTokenMethod<ImportExpressionAST> = (token: TokenType, ast: ImportExpressionAST) => {
        if (token.value == "}" && !ast.fromModule.value && ast.value.length != 0) {
            this.isDestructuring = false
            return true
        } else if (token.value == "{" && ast.value.length == 0) {
            this.isDestructuring = true
            this.isDestructured = true
            return this.setDelegate(new ModuleParser(), moduleAst => {
                this.setAst({
                    ...ast,
                    value: [...ast.value, moduleAst]
                })
            })
        } else if (token.type == "break" && this.isDestructuring) {
            return this.setDelegate(new ModuleParser(), moduleAst => {
                this.setAst({
                    ...ast,
                    value: [...ast.value, moduleAst]
                })
            })
        } else if (token.type == "identifier" && token.value != "from" && ast.value.length == 0) {
            return this.setAst({
                ...ast,
                value: [{ id: "module_literal", value: token.value }],
                lineNumber: token.lineNumber,
                position: token.position
            })
        } else if (token.type == "identifier" && token.value != "from") {
            if (token.lineNumber != ast.lineNumber && ast.value.length == 1 && !this.isDestructured) {
                this.setAst({
                    ...ast,
                    fromModule: ast.value[0]
                })
                return this.endParser({ refeed: token })
            }
        } else if (token.type == "identifier" && token.value == "from" && ast.value.length != 0) {
            return this.setDelegate(new FromModuleParser(), (mdleAst, refeed) => {
                this.setAst({
                    ...ast,
                    fromModule: mdleAst,
                    lineNumber: token.lineNumber,
                    position: token.position
                })
                this.endParser({ refeed })
            })
        }
        throw unexpectedToken(token, this.id)
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
        if (ast.value && token.type == "break") return this.endParser({ refeed: token })
        if (ast.value && token.type == "curly_brace" && token.value == "}") return this.endParser({ refeed: token })
        throw unexpectedToken(token, this.id)
    }
}

export class FromModuleParser extends Parser<ModuleAST> {
    constructor() {
        super("parse_from_module", {
            id: "module_literal",
            value: ""
        })
    }
    handleToken: HandleTokenMethod<ModuleAST> = (token, ast) => {
        if (token.type == "identifier" && !ast.value) {
            this.setAst({
                ...ast,
                value: token.value
            })
            return this.endParser()
        }
        throw unexpectedToken(token, this.id)
    }
}
