import { NumberAST, ValueAST, ObjectAST, ExpressionAST, KeyValueExpressionAST } from "../lang/definitions"

export type ObjectValue = { [key: string]: Value }
export type Value = string | number | boolean | Value[] | ObjectValue | Function | Range

export type Range = [number, number]

export const toNumber = (ast: NumberAST) => {
    if (ast.value == "inf") return Number.MAX_VALUE
    return parseFloat(ast.value!)
}

export const toVal = (ast: ValueAST): Value => {
    switch (ast.value?.id) {
        case "number_literal":
            return toNumber(ast.value)
        case "string_literal":
            return ast.value.value!
        case "boolean_literal":
            return ast.value.value!
        case "range_literal":
            return [toNumber(ast.value.value!.from!), toNumber(ast.value.value!.to!)] as Range
        case "array_literal":
            return ast.value.value?.map(val => toVal(val)) || []
        case "object_literal":
            return toObject(ast.value)!
        case "variable_literal":
            return ast.value?.value?.identifiers![0]
        default:
            throw new Error(`Couldn't cast value ${ast}`)
    }
}

export const toObject = (ast: ObjectAST) => {
    return expressionArrayToObject(ast.value!)
}

export const expressionArrayToObject = (asts: ExpressionAST[]) => {
    return asts.reduce((accum, expressionAst) => {
        // if expression ast is key value
        if (expressionAst.value?.id == "key_value") {
            const keyValAst = expressionAst.value as KeyValueExpressionAST
            accum[keyValAst.identifier] = toVal(keyValAst.value!)
        }
        return accum
    }, {} as { [key: string]: Value })
}

export const stringifyValue = (value: Value) => {
    if (typeof value == "object") return JSON.stringify(value).replace(/"/g, "")
    return `"${value}"`
}
