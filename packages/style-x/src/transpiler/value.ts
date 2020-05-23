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
    KeyValueExpressionAST,
    ConditionalExpressionAST
} from "../lang/definitions"
import { toNumber } from "./values"
import { moduleMethods } from "./main"

type PrimitiveValue = boolean | string | number | number[] | boolean[] | string[]

type PrimitiveMap = Record<string, PrimitiveValue>
type WithMappedPrimitives = PrimitiveMap | Record<string, PrimitiveMap> | PrimitiveMap[]
type Value =
    | PrimitiveMap
    | WithMappedPrimitives
    | Record<string, WithMappedPrimitives>
    | PrimitiveValue
    | WithMappedPrimitives[]
    | Value[]

export type Options = {
    mappedDefinitions?: Record<string, ValueAST>
    moduleMethods?: Record<string, "string" | "method">
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
    return objectAst.value!.reduce((accum, exprAst, i) => {
        if (exprAst.value!.id == "key_value") {
            const keyVal = exprAst.value! as KeyValueExpressionAST
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(accum as any),
                [keyVal.identifier]: valueAstToObject(keyVal.value!, options)
            }
        }
        const condAst = exprAst.value! as ConditionalExpressionAST

        const tupleConds = tupleAstToObject(condAst.condition!, options)
        const value = objectAstToObject(condAst.value!, options)

        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(accum as any),
            [`$_cond${i}`]: {
                cond: tupleConds,
                value
            }
        }
    }, {} as Value)
}
export const arrayAstToObject = (arrayAst: ArrayAST, options?: Options): Value => {
    return arrayAst.value!.map(valAst => valueAstToObject(valAst, options))
}
export const tupleAstToObject = (tupleAst: TupleAST, options?: Options): Value => {
    return tupleAst.value!.map(value => {
        if (value.id == "key_value") return valueAstToObject(value.value!, options)
        return valueAstToObject(value, options)
    })
}

export const rangeAstToObject = (rangeAst: RangeAST): Value => {
    return `range({from: ${rangeAst.value!.from?.value!}, to: ${rangeAst.value!.to?.value!}})`
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

    if (options?.moduleMethods && options?.moduleMethods[identifier]) {
        if (options.moduleMethods[identifier] == "method") return `${identifier}()`
        return `'${identifier}'`
    }

    return identifier
}

export const fnParametersToValue = (fnParams: FunctionParameterAST[], options?: Options): Value => {
    return fnParams!.reduce((accum, param, i) => {
        if (param.value!.value!.id == "key_value") {
            const keyVal = param.value!.value! as KeyValueExpressionAST
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(accum as any),
                [keyVal.identifier]: valueAstToObject(keyVal.value!, options)
            }
        }
        const condAst = param.value!.value! as ConditionalExpressionAST

        const tupleConds = tupleAstToObject(condAst.condition!, options)
        const value = objectAstToObject(condAst.value!, options)

        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(accum as any),
            [`$_cond${i}`]: {
                cond: tupleConds,
                value
            }
        }
    }, {} as Value)
}

export const writeValue = (value: Value) => {
    return JSON.stringify(value).replace(/"/g, "")
}
