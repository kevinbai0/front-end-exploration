export interface AST {
    id: ASTUnion["id"]
    lineNumber?: number
    position?: number
}

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
    value?: string
}

export interface BooleanAST extends AST {
    id: "boolean_literal"
    value?: boolean
}

export interface ObjectAST extends AST {
    id: "object_literal"
    value?: ExpressionAST[]
}

export interface TupleAST extends AST {
    id: "tuple_literal"
    value?: (ValueAST | KeyValueAST)[]
}

export interface ArrayAST extends AST {
    id: "array_literal"
    value?: ValueAST[]
}

export interface FunctionCallAST extends AST {
    id: "function_definition_param_literal"
    value?: FunctionParameterAST[]
}

export interface FunctionParameterAST extends AST {
    id: "function_parameter_literal"
    value?: ExpressionAST
}

export interface RangeAST extends AST {
    id: "range_literal"
    value?: {
        from?: NumberAST
        to?: NumberAST
    }
}

export interface VariableAST extends AST {
    id: "variable_literal"
    value?: {
        identifiers: string[]
        fnCall?: FunctionCallAST
    }
}

export interface ConditionalExpressionAST extends AST {
    id: "expression_conditional"
    condition?: TupleAST
    value?: ObjectAST
}

export interface ConditionalObjectAST extends AST {
    id: "object_conditional"
    conditions: TupleAST
    expressions: ConditionalExpressionAST
}

export type ConditionalASTs = ConditionalExpressionAST | ConditionalObjectAST

export interface ValueAST extends AST {
    id: "value_ast"
    value?: StringAST | NumberAST | BooleanAST | ObjectAST | ArrayAST | FunctionCallAST | VariableAST | RangeAST | TupleAST
}

export type ValueLiterals = StringAST | NumberAST | BooleanAST | ObjectAST | ArrayAST | VariableAST | FunctionCallAST | RangeAST | TupleAST

export interface ImportExpressionAST extends AST {
    id: "import_marker_literal"
    value: ModuleAST[]
    fromModule: ModuleAST
}
export interface ComponentMarkerAST extends AST {
    id: "component_marker_literal"
    value: ValueAST
}
export interface ExpressionAST extends AST {
    id: "expression"
    value?: KeyValueAST | ConditionalExpressionAST
}
export interface KeyValueAST extends AST {
    id: "key_value"
    identifier: string
    value?: ValueAST
}

export interface ProgramAST extends AST {
    id: "program"
    imports: ImportExpressionAST[]
    definitions: ExpressionAST[]
    component?: ComponentMarkerAST
}

export type ASTUnion =
    | ValueLiterals
    | ValueAST
    | ModuleAST
    | ExpressionAST
    | KeyValueAST
    | ImportExpressionAST
    | ComponentMarkerAST
    | ProgramAST
    | FunctionParameterAST
    | ConditionalASTs
