import fs from "fs"
import Lexer from "./lexer/lexer"
import { ParserStream } from "./parser/parser"
import { ProgramAST } from "./lang/definitions"
import { transpileProject } from "./transpiler/main"

async function parseStyleXFile(fileName: string) {
    const stream = runnableStream(fileName)

    stream.on("close", (data: ProgramAST) => {
        console.log(data)
    })

    return {}
}

export function runnableStream(fileName: string) {
    const readable = fs.createReadStream(fileName, {
        highWaterMark: 1
    })
    const stream = readable.pipe(new Lexer()).pipe(new ParserStream())

    return stream
}

transpileProject("./example")
