import { TokenType } from "../lexer/lexerDefinitions"
import { AST } from "prettier"

export type ParseType =
    | "parse_root_program"
    | "parse_root_import"
    | "parse_root_expects"
    | "parse_root_handlers"
    | "parse_root_component"
    | "parse_module"
    | "parse_expression"
    | "parse_type"
    | "parse_value"
    | "parse_object"
    | "parse_array"

export type HandleTokenMethod<T extends AST> = (token: TokenType, currAst: T) => true

export class Parser<T extends AST> {
    readonly id: ParseType
    private ast: T
    private _delegateParser?: Parser<AST>
    private _delegateFinishedHandler?: (ast: AST) => void
    private complete = false
    private shouldUnget?: boolean

    constructor(id: ParseType, ast: T) {
        this.id = id
        this.ast = ast
    }

    public getAst = () => {
        // TODO: Make deep copy of ast
        return this.ast
    }

    protected setAst = (ast: T): true => {
        this.ast = ast
        return true
    }
    protected setDelegate = <K extends AST>(parser: Parser<K>, completionHandler: (ast: K) => void): true => {
        this._delegateParser = parser
        this._delegateFinishedHandler = completionHandler
        this._delegateParser.onEnd = () => {
            this._delegateFinishedHandler && this._delegateFinishedHandler(this._delegateParser!.ast)
            // if the delegate parser completed, then unset it and let current parser parse
            this._delegateParser = undefined
            this._delegateFinishedHandler = undefined
        }
        return true
    }

    protected endParser(options?: { unget: boolean }): true {
        if (this._delegateParser?.complete === false) {
            console.error(new Error(`Parser "${this.id}" ended but delegate parser "${this._delegateParser.id}" is still parsing`))
        }
        this.complete = true
        this.shouldUnget = options?.unget

        this.onEnd()

        return true
    }

    private onEnd = () => {
        // to overwrite
    }

    protected handleToken: HandleTokenMethod<T> = () => true

    public receiveToken: (this: Parser<T>, token: TokenType) => void = token => {
        if (this.complete) {
            console.error(new Error(`Parser "${this.id}" ended but still receiving tokens`))
            return
        }
        if (this._delegateParser && !this._delegateParser.complete) {
            return this._delegateParser.receiveToken(token)
        }

        this.handleToken(token, this.ast)
    }
}
