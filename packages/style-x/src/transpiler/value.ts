import {
    ValueAST,
    NumberAST,
    StringAST,
    BooleanAST,
    ObjectAST,
    ArrayAST,
    TupleAST,
    VariableAST,
    FunctionParameterAST,
    RangeAST,
    KeyValueExpressionAST
} from "../lang/definitions"
import { toNumber } from "./values"

type PrimitiveValue = boolean | string | number | number[] | boolean[] | string[]

type PrimitiveMap = Record<string, PrimitiveValue>
type WithMappedPrimitives = PrimitiveMap | Record<string, PrimitiveMap> | PrimitiveMap[]
type Value = PrimitiveMap | WithMappedPrimitives | Record<string, WithMappedPrimitives> | PrimitiveValue | WithMappedPrimitives[] | Value[]

export type Options = {
    mappedDefinitions?: Record<string, ValueAST>
    moduleMethods?: Record<string, boolean>
}

export const valueAstToObject = (value: ValueAST, options?: Options): Value => {
    switch (value.value!.id) {
        case "number_literal":
            return toNumber(value.value! as NumberAST)
        case "string_literal":
            return `${(value.value! as StringAST).value!}`
        case "boolean_literal":
            return !!(value.value! as BooleanAST).value
        case "object_literal":
            return objectAstToObject(value.value! as ObjectAST, options)
        case "array_literal":
            return arrayAstToObject(value.value! as ArrayAST, options)
        case "tuple_literal":
            return tupleAstToObject(value.value! as TupleAST, options)
        case "variable_literal":
            return toIdentifier(value.value! as VariableAST, options)
        case "range_literal":
            return rangeAstToObject(value.value! as RangeAST)
    }
}

export const objectAstToObject = (objectAst: ObjectAST, options?: Options): Value => {
    return objectAst.value!.reduce((accum, exprAst) => {
        if (exprAst.value!.id == "key_value") {
            const keyVal = exprAst.value! as KeyValueExpressionAST
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(accum as any),
                [keyVal.identifier]: valueAstToObject(keyVal.value!, options)
            }
        }
        return accum
    }, {} as Value)
}
export const arrayAstToObject = (
    arrayAst: ArrayAST,
    options?: {
        mappedDefinitions?: Record<string, ValueAST>
        moduleMethods?: Record<string, boolean>
    }
): Value => {
    return arrayAst.value!.map(valAst => valueAstToObject(valAst, options))
}
export const tupleAstToObject = (tupleAst: TupleAST, options?: Options): Value => {
    return tupleAst.value!.map(value => {
        if (value.id == "key_value") return valueAstToObject(value.value!, options)
        return valueAstToObject(value, options)
    })
}

export const rangeAstToObject = (rangeAst: RangeAST): Value => {
    return {}
}

export const toIdentifier = (variable: VariableAST, options?: Options): string => {
    const identifier = (() => {
        const varName = variable.value!.identifiers.join(".")
        if (options?.mappedDefinitions && options?.mappedDefinitions[varName]) return `$${varName}`
        return varName
    })()

    if (variable.value?.fnCall) {
        const params = fnParametersToValue(variable.value?.fnCall!.value!, options)
        return `${identifier}(${writeValue(params)})`
    }

    if (options?.moduleMethods && options?.moduleMethods[identifier]) return `${identifier}()`

    return identifier
}

export const fnParametersToValue = (fnParams: FunctionParameterAST[], options?: Options): Value => {
    return fnParams!.reduce((accum, param) => {
        if (param.value!.value!.id == "key_value") {
            const keyVal = param.value!.value! as KeyValueExpressionAST
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(accum as any),
                [keyVal.identifier]: valueAstToObject(keyVal.value!, options)
            }
        }
        return accum
    }, {} as Value)
}

export const writeValue = (value: Value) => {
    return JSON.stringify(value).replace(/"/g, "")
}
