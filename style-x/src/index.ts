import fs from "fs"
import Tokenizer from "./parser/tokenizer"

async function parseStyleXFile(fileName: string) {
    const tokenizer = new Tokenizer()

    await lineReader(fileName, tokenizer.readChar)
    console.log("Finished")
    console.log(tokenizer.tokens)

    return {}
}

function lineReader(fileName: string, readChar: (char: string, code: number) => void) {
    return new Promise((res, rej) => {
        const readable = fs.createReadStream(fileName, {
            encoding: "utf8"
        })
        readable.on("readable", function() {
            let chunk: string
            while (null !== (chunk = readable.read(1)) /* here */) {
                readChar(chunk, chunk.charCodeAt(0))
            }
        })
        readable.on("end", res)
    })
}

parseStyleXFile("./examples/MenuColumn.stylex")
    .then(ast => console.log(ast))
    .catch(err => console.error(err))
