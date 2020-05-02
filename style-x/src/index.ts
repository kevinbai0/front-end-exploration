import fs from "fs"
import Lexer from "./lexer/lexer"
import { ParserStream } from "./parser/parser"
import { ProgramAST } from "./lang/definitions"

async function parseStyleXFile(fileName: string) {
    const stream = runnableStream(fileName)

    stream.on("close", (data: ProgramAST) => {
        console.log(data)
    })

    return {}
}

function runnableStream(fileName: string) {
    const readable = fs.createReadStream(fileName, {
        highWaterMark: 1
    })
    const stream = readable.pipe(new Lexer()).pipe(new ParserStream())

    return stream
}

parseStyleXFile("./examples/MenuColumn.stylex")
    .then(ast => console.log(ast))
    .catch(err => console.error(err))
