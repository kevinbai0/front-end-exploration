import { Parser, ParseType, PrimitiveParser } from "./parserDefinitions"
import { TokenType } from "../lexer/lexerDefinitions"

function unexpectedToken(token: TokenType) {
    return new Error(`Unexpected token ${token.value} on line ${token.lineNumber}:${token.position}`)
}

const primitiveParser: PrimitiveParser = {
    id: "root_program",
    ast: null,
    handleToken: () => ({
        complete: false
    }),
    receiveToken: function(token) {
        // if there is a delegate parser, route through that parser
        if (this.delegateParser) {
            const parsed = this.delegateParser.receiveToken(token)
            if (!parsed.complete) return parsed
            this.delegateFinishedHandler && this.delegateFinishedHandler(this.delegateParser.ast)
            if (parsed.unget) {
                const res = this.handleToken(
                    token,
                    this.ast,
                    (parser, onReceive) => {
                        this.delegateParser = parser
                        this.delegateFinishedHandler = onReceive
                    },
                    ast => (this.ast = ast)
                )
                return res
            }
            // if the delegate parser completed, then unset it and let other parser parse
            this.delegateParser = undefined
            return {
                complete: false
            }
        }

        const res = this.handleToken(
            token,
            this.ast,
            (parser, onReceive) => {
                this.delegateParser = parser
                this.delegateFinishedHandler = onReceive
            },
            ast => (this.ast = ast)
        )
        return res
    }
}

function createParser<T extends AST>(options: { id: ParseType; ast: T; handleToken: Parser<T>["handleToken"] }): Parser<T> {
    return {
        ...primitiveParser,
        id: options.id,
        ast: options.ast,
        handleToken: options.handleToken
    }
}

export const createRootParser = () =>
    createParser<ProgramAST>({
        id: "root_program",
        ast: { id: "program" },
        handleToken: (token, ast, setParser, setAst) => {
            if (token.type != "marker") throw unexpectedToken(token)
            switch (token.value) {
                case "@import":
                    setParser(createImportMarkerParser(), completedAst => {
                        setAst({
                            id: "program",
                            ...(ast as ProgramAST),
                            imports: completedAst as ImportMarkerLiteral
                        })
                    })
                    break
                default:
                    throw unexpectedToken(token)
            }
            return { complete: false }
        }
    })

/**
 * Expects { module, module, module }
 */
export const createImportMarkerParser = () =>
    createParser<ImportMarkerLiteral>({
        id: "root_import",
        ast: { id: "import_marker_literal", value: [] },
        handleToken: (token, ast, setParser, setAst) => {
            if (token.type != "curly_brace") throw unexpectedToken(token)
            if (token.value == "}" && ast == null) throw unexpectedToken(token)

            if (token.value == "{") {
                setParser(createModuleParser(), moduleAst => {
                    setAst({
                        ...(ast as ImportMarkerLiteral),
                        value: [...(ast as ImportMarkerLiteral).value, moduleAst as ModuleLiteral]
                    })
                })
                return { complete: false }
            }
            // assumes } token is received
            return { complete: true }
        }
    })

/**
 * Expects identifier and a comma
 */
export const createModuleParser = () =>
    createParser<ModuleLiteral>({
        id: "module",
        ast: { id: "module_literal", value: "" },
        handleToken: (token, ast, _, setAst) => {
            const moduleAst = ast as ModuleLiteral
            if (!moduleAst.value && token.type == "identifier") {
                setAst({
                    id: "module_literal",
                    value: token.value
                })
                return { complete: false }
            }
            if (moduleAst.value && token.type == "break") return { complete: true }
            if (moduleAst.value && token.type == "curly_brace" && token.value == "}") return { complete: true, unget: true }
            throw unexpectedToken(token)
        }
    })
