import {
    ValueAST,
    ObjectAST,
    KeyValueExpressionAST,
    ArrayAST,
    TupleAST,
    VariableAST
} from "../lang/definitions"

export const extractTypeFromValue = (value: ValueAST): string | undefined => {
    switch (value.value!.id) {
        case "number_literal":
            return "number"
        case "string_literal":
            return "string"
        case "boolean_literal":
            return "boolean"
        case "object_literal":
            return extractTypeFromObject(value.value! as ObjectAST)
        case "array_literal":
            return extractTypeFromArray(value.value! as ArrayAST)
        case "tuple_literal":
            return extractTypeFromTuple(value.value! as TupleAST)
        case "variable_literal":
            return extractTypeFromVariable(value.value! as VariableAST)
        default:
            return undefined
    }
}

export const extractTypeFromObject = (obj: ObjectAST): string => {
    return `{\n${obj
        .value!.map(exprAst => {
            if (exprAst.value!.id == "key_value") {
                const keyVal = exprAst.value! as KeyValueExpressionAST
                return `${keyVal.identifier}: ${extractTypeFromValue(keyVal.value!)}`
            }
            return ""
        })
        .filter(val => val.length)
        .join("\n")}\n}`
}

export const extractTypeFromArray = (arr: ArrayAST) => {
    if (!arr.value?.length) return "any[]"
    return `${extractTypeFromValue(arr.value[0])}[]`
}

export const extractTypeFromTuple = (tuple: TupleAST) => {
    return `[${tuple
        .value!.map(value => {
            if (value.id == "value_ast") return extractTypeFromValue(value)
            else return extractTypeFromValue(value.value!)
        })
        .join(", ")}]`
}

export const extractTypeFromVariable = (variable: VariableAST) => {
    if (!variable.value!.fnCall) return `typeof ${variable.value!.identifiers.join(".")}`
    return `(${variable
        .value!.fnCall.value!.map(param => {
            if (param.value!.value!.id == "key_value") {
                const keyVal = param.value!.value! as KeyValueExpressionAST
                return `${keyVal.identifier}: ${extractTypeFromValue(keyVal.value!)}`
            }
            return ""
        })
        .filter(value => value.length)
        .join(", ")}) => void`
}
