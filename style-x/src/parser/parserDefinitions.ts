import { TokenType } from "../lexer/lexerDefinitions"

export type ParseType = "root_program" | "root_import" | "root_expects" | "root_handlers" | "root_component" | "module"

export interface PrimitiveParser {
    id: ParseType
    ast: AST
    delegateParser?: PrimitiveParser
    delegateFinishedHandler?: (ast: AST) => void
    handleToken: (
        token: TokenType,
        currAst: AST,
        setParser: (parser: PrimitiveParser, onReceiveFullAST: (ast: AST) => void) => void,
        setAST: (ast: AST) => void
    ) => {
        complete: boolean
        unget?: boolean
    }
    receiveToken: (
        this: PrimitiveParser,
        token: TokenType
    ) => {
        complete: boolean
        unget?: boolean
    }
}

export interface Parser<T extends AST> extends PrimitiveParser {
    ast: T
    handleToken: (
        token: TokenType,
        currAst: AST,
        setParser: (parser: PrimitiveParser, onReceiveFullAST: (ast: AST) => void) => void,
        setAST: (ast: T) => void
    ) => {
        complete: boolean
        unget?: boolean
    }
    receiveToken: (
        this: PrimitiveParser,
        token: TokenType
    ) => {
        complete: boolean
        unget?: boolean
    }
}
