export interface AST {
    id: ASTUnion["id"]
    lineNumber?: number
    position?: number
}

// types
export interface TypescriptTypeAST extends AST {
    id: "typescript_type"
    value: string
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

export type TypeAST = StringTypeAST | NumberTypeAST | BooleanTypeAST | TypescriptTypeAST

// values
export interface ModuleAST extends AST {
    id: "module_literal"
    value: string
}

export interface StringAST extends AST {
    id: "string_literal"
    value?: string
}

export interface NumberAST extends AST {
    id: "number_literal"
    value?: number
}

export interface BooleanAST extends AST {
    id: "boolean_literal"
    value?: boolean
}

export interface ObjectAST extends AST {
    id: "object_literal"
    value?: ExpressionAST[]
}

export interface ArrayAST extends AST {
    id: "array_literal"
    value?: ValueAST[]
}

export interface ValueAST extends AST {
    id: "value_ast"
    value?: StringAST | NumberAST | BooleanAST | ObjectAST | ArrayAST | ModuleAST
}

export type ValueLiterals = StringAST | NumberAST | BooleanAST | ObjectAST | ArrayAST | ModuleAST

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
    value?: ObjectAST
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
    value?: ValueAST
}

export interface ProgramAST extends AST {
    id: "program"
    imports?: ImportMarkerAST
    expects?: ExpectsMarkerAST
    handlers?: HandlersMarkerAST
    component?: ComponentMarkerAST
}

export type ASTUnion = TypeAST | ValueLiterals | ValueAST | ExpressionAST | MarkerAST | FunctionDefinitionAST | FunctionDefinitionParamAST | ProgramAST
