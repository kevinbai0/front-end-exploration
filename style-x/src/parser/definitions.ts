// types
type TypescriptTypeLiteral = {
    id: "typescript_type"
    value: "string"
}

type StringTypeLiteral = {
    id: "string_type"
    value: "string"
}

type NumberTypeLiteral = {
    id: "number_type"
    value: "number"
}

type BooleanTypeLiteral = {
    id: "boolean_type"
    value: "boolean"
}

type UndefinedTypeLiteral = {
    id: "undefined_type"
    value: "undefined"
}

type TypeLiteral = StringTypeLiteral | NumberTypeLiteral | BooleanTypeLiteral | UndefinedTypeLiteral | TypescriptTypeLiteral

// values
type StringLiteral = {
    id: "string_literal"
    value: string
}

type NumberLiteral = {
    id: "number_literal"
    value: number
}

type BooleanLiteral = {
    id: "boolean_literal"
    value: boolean
}

type UndefinedLiteral = {
    id: "undefined_literal"
    value: undefined
}

type ObjectLiteral = {
    id: "object_literal"
    value: object
}

type ValueLiteral = StringLiteral | NumberLiteral | BooleanLiteral | UndefinedLiteral | ObjectLiteral

// modules defined inside @import
type ModuleLiteral = {
    id: "module_literal"
    value: string
}

type FunctionDefinitionParamLiteral = {
    id: "function_defintion_param_literal"
    identifier: string
    type: TypeLiteral
}

type FunctionDefinitionLiteral = {
    id: "function_definition_literal"
    identifier: string
    params: FunctionDefinitionParamLiteral[]
    return: TypeLiteral
}

type ImportMarkerLiteral = {
    id: "import_marker_literal"
    value: ModuleLiteral[]
}

type ExpectsMarkerLiteral = {
    id: "expects_marker_literal"
    value: ExpressionLiteral[]
}

type HandlersMarkerLiteral = {
    id: "handlers_marker_literal"
    value: (FunctionDefinitionLiteral | TypescriptTypeLiteral)[]
}

type ComponentMarkerLiteral = {
    id: "component_marker_literal"
}

type MarkerLiteral = ImportMarkerLiteral | ExpectsMarkerLiteral | HandlersMarkerLiteral | ComponentMarkerLiteral

type ExpressionLiteral = {
    id: "expression"
    identifier: string
    type: TypeLiteral
    defaultValue: ValueLiteral
}

type Literals = TypeLiteral | ValueLiteral | ExpressionLiteral | MarkerLiteral | ModuleLiteral | FunctionDefinitionLiteral | FunctionDefinitionParamLiteral

type AST = Literals[] | null
