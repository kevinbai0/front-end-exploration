import {
    ProgramAST,
    ImportExpressionAST,
    ModuleAST,
    ExpressionAST,
    ConditionalExpressionAST,
    ObjectAST,
    TupleAST,
    KeyValueExpressionAST,
    ValueAST,
    NumberAST,
    BooleanAST,
    StringAST,
    ArrayAST,
    VariableAST,
    FunctionCallAST,
    FunctionParameterAST,
    RangeAST
} from "../lang/definitions"

export const copyProgramAst = (ast: ProgramAST): ProgramAST => ({
    ...ast,
    imports: ast.imports.map(importAst => copyImportAst(importAst)),
    exports: ast.exports.map(val => copyKeyValueExpressionAST(val)),
    definitions: ast.definitions.map(val => copyKeyValueExpressionAST(val)),
    ...(ast.component && {
        component: {
            ...ast.component,
            value: copyValueAst(ast.component.value)
        }
    })
})

export const copyImportAst = (ast: ImportExpressionAST): ImportExpressionAST => ({
    ...ast,
    fromModule: copyModuleAst(ast.fromModule),
    value: ast.value.map(modAst => copyModuleAst(modAst))
})

export const copyExpressionAst = (ast: ExpressionAST): ExpressionAST => ({
    ...ast,
    ...(ast.value && { value: ast.value.id == "expression_conditional" ? copyConditionalExpressionAst(ast.value) : copyKeyValueExpressionAST(ast.value) })
})

export const copyConditionalExpressionAst = (ast: ConditionalExpressionAST): ConditionalExpressionAST => ({
    ...ast,
    ...(ast.condition && { condition: copyTupleAst(ast.condition) }),
    ...(ast.value && { value: copyObjectAst(ast.value) })
})

export const copyObjectAst = (ast: ObjectAST): ObjectAST => ({
    ...ast,
    ...(ast.value && { value: ast.value.map(val => copyExpressionAst(val)) })
})

export const copyTupleAst = (ast: TupleAST): TupleAST => ({
    ...ast,
    ...(ast.value && { value: ast.value.map(val => (val.id == "key_value" ? copyKeyValueExpressionAST(val) : copyValueAst(val))) })
})

export const copyKeyValueExpressionAST = (ast: KeyValueExpressionAST): KeyValueExpressionAST => ({
    ...ast,
    ...(ast.value && { value: copyValueAst(ast.value) })
})

export const copyValueAst = (ast: ValueAST): ValueAST => {
    if (!ast.value) return { ...ast }
    switch (ast.value.id) {
        case "number_literal":
            return { ...ast, value: copyNumberAst(ast.value) }
        case "boolean_literal":
            return { ...ast, value: copyBooleanAst(ast.value) }
        case "string_literal":
            return { ...ast, value: copyStringAst(ast.value) }
        case "array_literal":
            return { ...ast, value: copyArrayAst(ast.value) }
        case "tuple_literal":
            return { ...ast, value: copyTupleAst(ast.value) }
        case "object_literal":
            return { ...ast, value: copyObjectAst(ast.value) }
        case "variable_literal":
            return { ...ast, value: copyVariableAst(ast.value) }
        case "range_literal":
            return { ...ast, value: copyRangeAst(ast.value) }
    }
}

export const copyArrayAst = (ast: ArrayAST): ArrayAST => ({
    ...ast,
    ...(ast.value && { value: ast.value.map(val => copyValueAst(val)) })
})

export const copyVariableAst = (ast: VariableAST): VariableAST => ({
    ...ast,
    ...(ast.value && {
        value: {
            identifiers: [...ast.value.identifiers],
            ...(ast.value.fnCall && { fnCall: copyFunctionCallAst(ast.value.fnCall) })
        }
    })
})

export const copyFunctionCallAst = (ast: FunctionCallAST): FunctionCallAST => ({
    ...ast,
    ...(ast.value && { value: ast.value.map(val => copyFunctionParameterAst(val)) })
})

export const copyFunctionParameterAst = (ast: FunctionParameterAST): FunctionParameterAST => ({
    ...ast,
    ...(ast.value && { value: copyExpressionAst(ast.value) })
})

export const copyRangeAst = (ast: RangeAST): RangeAST => ({
    ...ast,
    ...(ast.value && {
        value: {
            ...(ast.value.to && { to: copyNumberAst(ast.value.to) }),
            ...(ast.value.from && { from: copyNumberAst(ast.value.from) })
        }
    })
})
// all values are primitives
export const copyModuleAst = (ast: ModuleAST): ModuleAST => ({ ...ast })
export const copyNumberAst = (ast: NumberAST): NumberAST => ({ ...ast })
export const copyBooleanAst = (ast: BooleanAST): BooleanAST => ({ ...ast })
export const copyStringAst = (ast: StringAST): StringAST => ({ ...ast })
