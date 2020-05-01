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

export interface TupleAST<T extends number> extends AST {
    id: "tuple_literal"
    length: T
    value?: (ValueAST | ExpressionAST)[]
}

export interface ArrayAST extends AST {
    id: "array_literal"
    value?: ValueAST[]
}

export interface FunctionCallAST extends AST {
    id: "function_defintion_param_literal"
    identifier: string
    value?: FunctionParameterAST[]
}

export interface FunctionParameterAST extends AST {
    id: "function_parameter_literal"
    value?: ExpressionAST
}

export interface RangeConditionalAST extends AST {
    id: "range_expression_conditional"
    from: NumberAST
    to: NumberAST
}

export interface ConditionalExpressionAST<Length extends number> extends AST {
    id: "expression_conditional"
    ifThen: {
        condition: TupleAST<Length>
        value: ObjectAST
    }[]
}

export interface ConditionalObjectAST<Length extends number> extends AST {
    id: "object_conditional"
    conditions: TupleAST<Length>
    expressions: ConditionalExpressionAST<Length>
}

export type ConditionalASTs = ConditionalExpressionAST<number> | ConditionalObjectAST<number>

export interface ValueAST extends AST {
    id: "value_ast"
    value?: StringAST | NumberAST | BooleanAST | ObjectAST | ArrayAST | FunctionCallAST | ModuleAST | TupleAST<number> | RangeConditionalAST
}

export type ValueLiterals = StringAST | NumberAST | BooleanAST | ObjectAST | ArrayAST | ModuleAST | FunctionCallAST | TupleAST<number> | RangeConditionalAST

export interface ImportExpressionAST extends AST {
    id: "import_marker_literal"
    value: ModuleAST[]
    fromModule: ModuleAST
}
export interface ComponentMarkerAST extends AST {
    id: "component_marker_literal"
}

export interface ExpressionAST extends AST {
    id: "expression"
    identifier: string
    value?: ValueAST
}

export interface ProgramAST extends AST {
    id: "program"
    imports: ImportExpressionAST[]
    definitions: ExpressionAST[]
    component?: ComponentMarkerAST
}

export type ASTUnion = ValueLiterals | ValueAST | ExpressionAST | ImportExpressionAST | ComponentMarkerAST | ProgramAST | FunctionParameterAST | ConditionalASTs
