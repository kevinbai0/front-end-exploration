import { TokenType } from "../lexer/lexerDefinitions"
import { AST } from "prettier"

export type ParseType = "root_program" | "root_import" | "root_expects" | "root_handlers" | "root_component" | "module" | "expression"
export type HandleTokenMethod = (
    token: TokenType,
    currAst: AST
) => {
    complete: boolean
    unget?: boolean
}

export class Parser<T extends AST> {
    readonly id: ParseType
    private ast: T
    private _delegateParser?: Parser<AST>
    private _delegateFinishedHandler?: (ast: AST) => void

    constructor(id: ParseType, ast: T) {
        this.id = id
        this.ast = ast
    }

    public getAst = () => {
        // TODO: Make deep copy of ast
        return this.ast
    }

    protected setAst = (ast: T) => {
        this.ast = ast
    }
    protected setDelegate = <K extends AST>(parser: Parser<K>, completionHandler: (ast: K) => void) => {
        this._delegateParser = parser
        this._delegateFinishedHandler = completionHandler
    }

    protected handleToken = (token: TokenType, currAst: T): { complete: boolean; unget?: boolean } => ({ complete: false })

    public receiveToken: (
        this: Parser<T>,
        token: TokenType
    ) => {
        complete: boolean
        unget?: boolean
    } = token => {
        if (this._delegateParser) {
            const parsed = this._delegateParser.receiveToken(token)
            if (!parsed.complete) return parsed
            this._delegateFinishedHandler && this._delegateFinishedHandler(this._delegateParser.ast)
            if (parsed.unget) {
                const res = this.handleToken(token, this.ast)
                return res
            }
            // if the delegate parser completed, then unset it and let other parser parse
            this._delegateParser = undefined
            return {
                complete: false
            }
        }

        const res = this.handleToken(token, this.ast)
        return res
    }
}
