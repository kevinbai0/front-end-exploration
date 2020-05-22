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

export const valueAstToObject = (value: ValueAST, mappedDefinitions?: Record<string, ValueAST>): Value => {
    switch (value.value!.id) {
        case "number_literal":
            return toNumber(value.value! as NumberAST)
        case "string_literal":
            return `${(value.value! as StringAST).value!}`
        case "boolean_literal":
            return !!(value.value! as BooleanAST).value
        case "object_literal":
            return objectAstToObject(value.value! as ObjectAST, mappedDefinitions)
        case "array_literal":
            return arrayAstToObject(value.value! as ArrayAST, mappedDefinitions)
        case "tuple_literal":
            return tupleAstToObject(value.value! as TupleAST, mappedDefinitions)
        case "variable_literal":
            return toIdentifier(value.value! as VariableAST, mappedDefinitions)
        case "range_literal":
            return rangeAstToObject(value.value! as RangeAST)
    }
}

export const objectAstToObject = (objectAst: ObjectAST, mappedDefinitions?: Record<string, ValueAST>): Value => {
    return objectAst.value!.reduce((accum, exprAst) => {
        if (exprAst.value!.id == "key_value") {
            const keyVal = exprAst.value! as KeyValueExpressionAST
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(accum as any),
                [keyVal.identifier]: valueAstToObject(keyVal.value!, mappedDefinitions)
            }
        }
        return accum
    }, {} as Value)
}
export const arrayAstToObject = (arrayAst: ArrayAST, mappedDefinitions?: Record<string, ValueAST>): Value => {
    return arrayAst.value!.map(valAst => valueAstToObject(valAst, mappedDefinitions))
}
export const tupleAstToObject = (tupleAst: TupleAST, mappedDefinitions?: Record<string, ValueAST>): Value => {
    return tupleAst.value!.map(value => {
        if (value.id == "key_value") return valueAstToObject(value.value!, mappedDefinitions)
        return valueAstToObject(value, mappedDefinitions)
    })
}

export const rangeAstToObject = (rangeAst: RangeAST): Value => {
    return {}
}

export const toIdentifier = (variable: VariableAST, mappedDefinitions?: Record<string, ValueAST>): string => {
    if (variable.value?.fnCall) {
        return "undefined"
    }
    const varName = variable.value!.identifiers.join(".")
    if (mappedDefinitions && mappedDefinitions[varName]) return `$${varName}`
    return varName
}

export const fnParametersToValue = (fnParams: FunctionParameterAST[], mappedDefinitions?: Record<string, ValueAST>): Value => {
    return fnParams!.reduce((accum, param) => {
        if (param.value!.value!.id == "key_value") {
            const keyVal = param.value!.value! as KeyValueExpressionAST
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(accum as any),
                [keyVal.identifier]: valueAstToObject(keyVal.value!, mappedDefinitions)
            }
        }
        return accum
    }, {} as Value)
}

export const writeValue = (value: Value) => {
    return JSON.stringify(value).replace(/"/g, "")
}
