import { Parser, HandleTokenMethod } from "../parserDefinitions"
import { ValueAST, ObjectAST, ExpressionAST, ArrayAST, ValueLiterals, FunctionCallAST } from "../definitions"
import { unexpectedToken } from "./rootParser"
import { TokenType } from "../../lexer/lexerDefinitions"

export class ObjectParser extends Parser<ObjectAST> {
    constructor() {
        super("parse_object", {
            id: "object_literal"
        })
    }

    handleToken: HandleTokenMethod<ObjectAST> = (token, ast) => {
        if (token.type == "identifier") {
            return this.setDelegate(new ExpressionParser(token.value), exprAst => {
                this.setAst({
                    ...ast,
                    value: [...(ast.value || []), exprAst],
                    lineNumber: token.lineNumber,
                    position: token.position
                })
            })
        }
        if (token.type == "curly_brace" && token.value == "}") {
            return this.endParser()
        }
        throw unexpectedToken(token, this.id)
    }
}

export class ExpressionParser extends Parser<ExpressionAST> {
    constructor(identifier?: string) {
        super("parse_expression", {
            id: "expression",
            identifier: identifier || ""
        })
    }

    handleToken: HandleTokenMethod<ExpressionAST> = (token, ast) => {
        if (token.type == "identifier" && !ast.identifier) {
            return this.setAst({
                ...ast,
                identifier: token.value
            })
        }
        if (token.type == "equal" && ast.identifier) {
            // delegate value
            return this.setDelegate(new ValueParser(), (valAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: valAst,
                    lineNumber: token.lineNumber,
                    position: token.position
                })
                this.endParser({ refeed })
            })
        }
        throw unexpectedToken(token, this.id)
    }
}

export class ValueParser extends Parser<ValueAST> {
    constructor(firstToken?: TokenType) {
        super("parse_value", { id: "value_ast" })
        if (firstToken) this.receiveToken(firstToken)
    }

    handleToken: HandleTokenMethod<ValueAST> = (token, ast) => {
        if (ast.value?.id == "module_literal") {
            // we need to look at the current token and see if it is a parenthesis
            if ((token.type == "paren" && token.value == "(") || (token.type == "square_brace" && token.value == "[")) {
                return this.setDelegate(new FunctionParameterParser(token.value, ast.value.value), (funAst, refeed) => {
                    this.setAst({
                        ...ast,
                        value: funAst,
                        lineNumber: token.lineNumber,
                        position: token.position
                    })
                    this.endParser({ refeed })
                })
            }
            return this.endParser({ refeed: token })
        }

        if (token.type == "string") {
            this.setAst({
                ...ast,
                value: {
                    id: "string_literal",
                    value: token.value,
                    lineNumber: token.lineNumber,
                    position: token.position
                }
            })
            return this.endParser()
        } else if (token.type == "number") {
            const num = parseInt(token.value)
            if (isNaN(num)) throw new Error(`Expected number but got ${token.value} instead on line ${token.lineNumber}:${token.position}`)
            this.setAst({
                ...ast,
                value: {
                    id: "number_literal",
                    value: num,
                    lineNumber: token.lineNumber,
                    position: token.position
                }
            })
            return this.endParser()
        } else if (token.type == "identifier") {
            this.setAst({
                ...ast,
                value: {
                    id: "module_literal",
                    value: token.value,
                    lineNumber: token.lineNumber,
                    position: token.position
                }
            })
            // don't end parser since we need to check for fun calls
            return true
        } else if (token.type == "curly_brace" && token.value == "{") {
            return this.setDelegate(new ObjectParser(), (objAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: objAst,
                    lineNumber: objAst.lineNumber,
                    position: objAst.position
                })
                this.endParser({ refeed })
            })
        } else if (token.type == "square_brace" && token.value == "[") {
            return this.setDelegate(new ArrayParser(), (arrAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: arrAst,
                    lineNumber: token.lineNumber,
                    position: token.position
                })
                this.endParser({ refeed })
            })
        } else throw unexpectedToken(token, this.id)
    }
}

export class ArrayParser extends Parser<ArrayAST> {
    type?: ValueLiterals["id"]
    constructor() {
        super("parse_array", {
            id: "array_literal",
            value: []
        })
    }

    handleToken: HandleTokenMethod<ArrayAST> = (token, ast) => {
        if (token.type == "square_brace" && token.value == "]") {
            return this.endParser()
        }
        return this.setDelegate(new ValueParser(token.type == "break" ? undefined : token), valAst => {
            if (this.type == "module_literal" && valAst.value?.value && valAst.value.id != "module_literal") {
                this.type = valAst.value.id
            }
            if (this.type && this.type != "module_literal" && valAst.value?.id != "module_literal" && this.type != valAst.value?.id) {
                throw new Error(
                    `Unexpected array type "${valAst.value?.id}" when expected type "${this.type}" on line ${valAst.value?.lineNumber}:${valAst.value?.position}`
                )
            }
            this.setAst({
                ...ast,
                value: [...(ast.value || []), valAst],
                lineNumber: token.lineNumber,
                position: token.position
            })
        })
    }
}

export class FunctionParameterParser extends Parser<FunctionCallAST> {
    openCharacter: "(" | "["
    constructor(openCharacter: "(" | "[", identifier: string) {
        super("parse_function_parameter", {
            id: "function_defintion_param_literal",
            identifier
        })
        this.openCharacter = openCharacter
    }

    handleToken: HandleTokenMethod<FunctionCallAST> = (token, ast) => {
        if (token.type == "identifier") {
            return this.setDelegate(new ExpressionParser(token.value), exprAst => {
                this.setAst({
                    ...ast,
                    value: [...(ast.value || []), { id: "function_parameter_literal", value: exprAst }],
                    lineNumber: token.lineNumber,
                    position: token.position
                })
            })
        }
        if (token.type == "paren" && this.openCharacter == "(") {
            return this.endParser()
        }
        if (token.type == "square_brace" && this.openCharacter == "[") {
            return this.endParser()
        }
        throw unexpectedToken(token, this.id)
    }
}
