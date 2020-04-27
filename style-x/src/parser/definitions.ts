export interface AST {
    id: ASTUnion["id"]
}

// types
export interface TypescriptTypeAST extends AST {
    id: "typescript_type"
    value: "string"
}

export interface StringTypeAST extends AST {
    id: "string_type"
    value: "string"
}

export interface NumberTypeAST extends AST {
    id: "number_type"
    value: "number"
}

export interface BooleanTypeAST extends AST {
    id: "boolean_type"
    value: "boolean"
}

export interface UndefinedTypeAST extends AST {
    id: "undefined_type"
    value: "undefined"
}

export type TypeAST = StringTypeAST | NumberTypeAST | BooleanTypeAST | UndefinedTypeAST | TypescriptTypeAST

// values
export interface StringAST extends AST {
    id: "string_literal"
    value: string
}

export interface NumberAST extends AST {
    id: "number_literal"
    value: number
}

export interface BooleanAST extends AST {
    id: "boolean_literal"
    value: boolean
}

export interface UndefinedAST extends AST {
    id: "undefined_literal"
    value: undefined
}

export interface ObjectAST extends AST {
    id: "object_literal"
    value: object
}

type ValueAST = StringAST | NumberAST | BooleanAST | UndefinedAST | ObjectAST

// modules defined inside @import
export interface ModuleAST extends AST {
    id: "module_literal"
    value: string
}

export interface FunctionDefinitionParamAST extends AST {
    id: "function_defintion_param_literal"
    identifier: string
    type: TypeAST
}

export interface FunctionDefinitionAST extends AST {
    id: "function_definition_literal"
    identifier: string
    params: FunctionDefinitionParamAST[]
    return: TypeAST
}

export interface ImportMarkerAST extends AST {
    id: "import_marker_literal"
    value: ModuleAST[]
}

export interface ExpectsMarkerAST extends AST {
    id: "expects_marker_literal"
    value: ExpressionAST[]
}

export interface HandlersMarkerAST extends AST {
    id: "handlers_marker_literal"
    value: (FunctionDefinitionAST | TypescriptTypeAST)[]
}

export interface ComponentMarkerAST extends AST {
    id: "component_marker_literal"
}

export type MarkerAST = ImportMarkerAST | ExpectsMarkerAST | HandlersMarkerAST | ComponentMarkerAST

export interface ExpressionAST extends AST {
    id: "expression"
    identifier: string
    type?: TypeAST
    defaultValue?: ValueAST
}

export interface ProgramAST extends AST {
    id: "program"
    imports?: ImportMarkerAST
    expects?: ExpectsMarkerAST
    handlers?: HandlersMarkerAST
    component?: ComponentMarkerAST
}

export type ASTUnion = TypeAST | ValueAST | ExpressionAST | MarkerAST | ModuleAST | FunctionDefinitionAST | FunctionDefinitionParamAST | ProgramAST
