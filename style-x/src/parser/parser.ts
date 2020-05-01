import { TokenType } from "../lexer/lexerDefinitions"
import { RootParser } from "./parsers/rootParser"
import { Transform, TransformCallback } from "stream"

/*export function parser(tokens: TokenType[]) {
    const parser = new RootParser()

    for (const token of tokens) {
        parser.receiveToken(token)
    }

    console.log(JSON.stringify(parser.getAst()))
}
*/

export class ParserStream extends Transform {
    rootParser = new RootParser()
    constructor() {
        super({
            objectMode: true,
            highWaterMark: 1
        })
    }
    _transform(chunk: TokenType, _: string, callback: TransformCallback) {
        this.rootParser.receiveToken(chunk)
        if (chunk.type == "eof") {
            this.emit("close", this.rootParser.getAst())
        }
        callback()
    }
}
