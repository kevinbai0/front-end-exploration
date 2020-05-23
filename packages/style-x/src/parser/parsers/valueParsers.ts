import { Parser, HandleTokenMethod } from "../parserDefinitions"
import {
    ValueAST,
    ObjectAST,
    ExpressionAST,
    ArrayAST,
    ValueLiterals,
    FunctionCallAST,
    ConditionalExpressionAST,
    TupleAST,
    KeyValueExpressionAST,
    RangeAST,
    VariableAST
} from "../../lang/definitions"
import { unexpectedToken } from "./rootParser"
import { TokenType } from "../../lexer/lexerDefinitions"

export class ObjectParser extends Parser<ObjectAST> {
    constructor() {
        super("parse_object", {
            id: "object_literal"
        })
    }

    handleToken: HandleTokenMethod<ObjectAST> = (token, ast, previousToken) => {
        if (token.type == "break" && ast.value && previousToken?.type != "break") {
            return true
        }
        if (token.type == "identifier" || token.type == "arrow") {
            return this.setDelegate(new ExpressionParser(token), exprAst => {
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
    identifierToken?: TokenType
    constructor(identifier?: TokenType) {
        super("parse_expression", {
            id: "expression"
        })
        this.identifierToken = identifier
    }

    onInit = () => {
        if (this.identifierToken) this.receiveToken(this.identifierToken)
    }

    handleToken: HandleTokenMethod<ExpressionAST> = (token, ast) => {
        if (token.type == "identifier") {
            return this.setDelegate(
                new KeyValueExpressionParser({ overridable: false }, token),
                (KeyValueExpressionAST, refeed) => {
                    this.setAst({
                        ...ast,
                        value: KeyValueExpressionAST
                    })
                    this.endParser({ refeed })
                }
            )
        } else if (token.type == "arrow" && token.value == "=>") {
            return this.setDelegate(new ConditionalExpressionParser(), (cdnAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: cdnAst
                })
                this.endParser({ refeed })
            })
        }

        throw unexpectedToken(token, this.id)
    }
}

export class KeyValueExpressionParser extends Parser<KeyValueExpressionAST> {
    initToken?: TokenType
    constructor(options: { overridable: boolean }, initToken?: TokenType) {
        super("parse_key_value", {
            id: "key_value",
            identifier: "",
            overridable: options.overridable
        })

        this.initToken = initToken
    }

    onInit = () => {
        if (this.initToken) this.receiveToken(this.initToken)
    }

    handleToken: HandleTokenMethod<KeyValueExpressionAST> = (token, ast) => {
        if (token.type == "identifier" && !ast.value) {
            return this.setAst({
                ...ast,
                identifier: token.value
            })
        }
        if (token.type == "equal") {
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
    firstToken?: TokenType
    constructor(firstToken?: TokenType) {
        super("parse_value", { id: "value_ast" })
        this.firstToken = firstToken
    }

    onInit = () => {
        if (this.firstToken) this.receiveToken(this.firstToken)
    }

    handleToken: HandleTokenMethod<ValueAST> = (token, ast) => {
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
            this.setAst({
                ...ast,
                value: {
                    id: "number_literal",
                    value: token.value,
                    lineNumber: token.lineNumber,
                    position: token.position
                }
            })
            return this.endParser()
        } else if (token.type == "identifier") {
            return this.setDelegate(new VariableParser(token), (varAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: varAst
                })
                this.endParser({ refeed })
            })
            // don't end parser since we need to check for fun calls
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
            return this.setDelegate(new ArrayOrRangeParser(), (arrAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: arrAst,
                    lineNumber: token.lineNumber,
                    position: token.position
                })
                this.endParser({ refeed })
            })
        } else if (token.type == "paren" && token.value == "(") {
            return this.setDelegate(new TupleParser(), (tupleAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: tupleAst
                })
                this.endParser({ refeed })
            })
        } else {
            throw unexpectedToken(token, this.id)
        }
    }
}

export class ArrayOrRangeParser extends Parser<ArrayAST | RangeAST> {
    type?: ValueLiterals["id"]
    mightBeRange?: RangeAST = {
        id: "range_literal"
    }
    mightBeArray?: ArrayAST = {
        id: "array_literal"
    }

    constructor() {
        super("parse_array", {
            id: "array_literal"
        })
    }

    handleToken: HandleTokenMethod<ArrayAST | RangeAST> = (token, ast) => {
        if (token.type == "square_brace" && token.value == "]") {
            return this.endParser()
        }
        if (
            token.type == "number" &&
            !ast.value &&
            !this.mightBeArray?.value &&
            !this.mightBeRange?.value
        ) {
            if (!this.mightBeRange) throw unexpectedToken(token, this.id)
            this.mightBeRange = {
                ...this.mightBeRange,
                value: {
                    from: { id: "number_literal", value: token.value }
                }
            }
            if (!this.mightBeArray) throw unexpectedToken(token, this.id)
            this.mightBeArray = {
                ...this.mightBeArray,
                value: [
                    ...(this.mightBeArray?.value || []),
                    { id: "value_ast", value: { id: "number_literal", value: token.value } }
                ]
            }
            return true
        } else if (token.type == "number" && !this.mightBeArray) {
            if (!this.mightBeRange?.value?.from) throw unexpectedToken(token, this.id)

            return this.setAst({
                id: "range_literal",
                value: {
                    from: this.mightBeRange.value.from,
                    to: { id: "number_literal", value: token.value }
                }
            })
        } else if (
            token.type == "identifier" &&
            token.value == "to" &&
            this.mightBeRange?.value?.from
        ) {
            this.mightBeArray = undefined
            return true
        } else if (token.type == "identifier" && token.value == "to")
            throw unexpectedToken(token, this.id)
        else {
            this.mightBeRange = undefined
            if (this.mightBeArray) {
                this.setAst({
                    id: "array_literal",
                    value: [...(this.mightBeArray.value || [])]
                })
            }
            return this.setDelegate(
                new ValueParser(token.type == "break" ? undefined : token),
                valAst => {
                    if (
                        this.type == "variable_literal" &&
                        valAst.value?.value &&
                        valAst.value.id != "variable_literal"
                    ) {
                        this.type = valAst.value.id
                    }
                    if (
                        this.type &&
                        this.type != "variable_literal" &&
                        valAst.value?.id != "variable_literal" &&
                        this.type != valAst.value?.id
                    ) {
                        throw new Error(
                            `Unexpected array type "${valAst.value?.id}" when expected type "${this.type}" on line ${valAst.value?.lineNumber}:${valAst.value?.position}`
                        )
                    }
                    this.setAst({
                        id: "array_literal",
                        value: [...((ast.value as ValueAST[]) || []), valAst],
                        lineNumber: token.lineNumber,
                        position: token.position
                    })
                }
            )
        }
    }
}

export class FunctionParameterParser extends Parser<FunctionCallAST> {
    constructor() {
        super("parse_function_parameter", {
            id: "function_definition_param_literal"
        })
    }

    handleToken: HandleTokenMethod<FunctionCallAST> = (token, ast, previousToken) => {
        if (token.type == "break" && ast.value && previousToken?.type != "break") {
            return true
        }
        if (token.type == "identifier") {
            return this.setDelegate(new ExpressionParser(token), exprAst => {
                this.setAst({
                    ...ast,
                    value: [
                        ...(ast.value || []),
                        { id: "function_parameter_literal", value: exprAst }
                    ],
                    lineNumber: token.lineNumber,
                    position: token.position
                })
            })
        }
        if (token.type == "paren" && token.value == ")") {
            return this.endParser()
        }
        throw unexpectedToken(token, this.id)
    }
}

export class VariableParser extends Parser<VariableAST> {
    firstIdentifier?: TokenType
    constructor(firstIdentifier?: TokenType) {
        super("parse_variable", {
            id: "variable_literal"
        })
        this.firstIdentifier = firstIdentifier
    }

    onInit = () => {
        if (this.firstIdentifier) this.receiveToken(this.firstIdentifier)
    }

    handleToken: HandleTokenMethod<VariableAST> = (token, ast, previousToken) => {
        // we need to look at the current token and see if it is a parenthesis
        if (token.type == "identifier" && !previousToken) {
            return this.setAst({
                ...ast,
                value: {
                    ...ast.value,
                    identifiers: [...(ast.value?.identifiers || []), token.value]
                }
            })
        } else if (token.type == "dot" && previousToken?.type == "identifier") {
            return true
        } else if (token.type == "identifier" && previousToken?.type == "dot") {
            return this.setAst({
                ...ast,
                value: {
                    ...ast.value,
                    identifiers: [...(ast.value?.identifiers || []), token.value]
                }
            })
        } else if (
            token.type == "paren" &&
            token.value == "(" &&
            (previousToken?.type == "identifier" || previousToken?.value == "(")
        ) {
            return this.setDelegate(new FunctionParameterParser(), funAst => {
                this.setAst({
                    ...ast,
                    value: {
                        identifiers: ast.value?.identifiers || [],
                        fnCall: {
                            id: "function_definition_param_literal",
                            value: [...(ast.value?.fnCall?.value || []), ...(funAst.value || [])]
                        }
                    },
                    lineNumber: token.lineNumber,
                    position: token.position
                })
            })
        }
        return this.endParser({ refeed: token })
    }
}

export class TupleParser extends Parser<TupleAST> {
    constructor() {
        super("parse_tuple", {
            id: "tuple_literal"
        })
    }

    danglingIdentifier?: TokenType

    handleToken: HandleTokenMethod<TupleAST> = (token, ast) => {
        if (token.type == "break" && (ast.value || this.danglingIdentifier)) {
            // identifier was the tuple value
            if (this.danglingIdentifier) {
                this.setAst({
                    ...ast,
                    value: [
                        ...(ast.value || []),
                        {
                            id: "value_ast",
                            value: {
                                id: "variable_literal",
                                value: {
                                    identifiers: [this.danglingIdentifier.value]
                                }
                            }
                        }
                    ]
                })
                this.danglingIdentifier = undefined
            }
            return true
        }
        // if there isn't a dangling identifier, set it since we don't know if it's the identifier or value
        if (token.type == "identifier" && !this.danglingIdentifier) {
            this.danglingIdentifier = token
            return true
        }
        if (token.type == "colon" && this.danglingIdentifier) {
            return this.setDelegate(new ValueParser(), (valAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: [
                        ...(ast.value || []),
                        {
                            id: "key_value",
                            identifier: this.danglingIdentifier!.value,
                            value: valAst
                        }
                    ]
                })
                this.danglingIdentifier = undefined
                if (refeed) this.receiveToken(refeed)
            })
        }
        if (token.type == "paren" && token.value == ")" && ast.value) return this.endParser()

        // if we get some other token, process as a value for the tuple
        if (token.type != "identifier" && !this.danglingIdentifier) {
            return this.setDelegate(new ValueParser(token), (valAst, refeed) => {
                this.setAst({
                    ...ast,
                    value: [...(ast.value || []), valAst]
                })
                if (refeed) this.receiveToken(refeed)
            })
        }

        throw unexpectedToken(token, this.id)
    }
}

export class ConditionalExpressionParser extends Parser<ConditionalExpressionAST> {
    constructor() {
        super("parse_conditional_expression", {
            id: "expression_conditional"
        })
    }

    seenEqual = false

    handleToken: HandleTokenMethod<ConditionalExpressionAST> = (token, ast) => {
        if (token.type == "square_brace" && token.value == "[" && !ast.condition) {
            return this.setDelegate(new ValueParser(token), rngAst => {
                this.setAst({
                    ...ast,
                    condition: {
                        id: "tuple_literal",
                        value: [rngAst]
                    }
                })
            })
        } else if (token.type == "paren" && token.value == "(" && !ast.condition) {
            return this.setDelegate(new TupleParser(), tupleAst => {
                this.setAst({
                    ...ast,
                    condition: tupleAst
                })
            })
        } else if (ast.condition && token.type == "equal" && !this.seenEqual) {
            this.seenEqual = true
            return true
        } else if (
            ast.condition &&
            token.type == "curly_brace" &&
            token.value == "{" &&
            this.seenEqual
        ) {
            return this.setDelegate(new ObjectParser(), (obj, refeed) => {
                this.setAst({
                    ...ast,
                    value: obj
                })
                this.endParser({ refeed })
            })
        }
        throw unexpectedToken(token, this.id)
    }
}
