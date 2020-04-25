import fs from "fs"
import readline from "readline"
import * as Tokenizer from "./tokenizer"

function tokenize(str: string, lineNumber: number, currPosition: number): Tokenizer.TokenType | undefined {
    if (str.length == 0) return
    const char = str.charAt(currPosition)
    const charCode = str.charCodeAt(currPosition)
    if (char == "/") return Tokenizer.tokenizeForwardSlash(str, lineNumber, currPosition)
    else if (char == "@") return Tokenizer.tokenizeMarker(str, lineNumber, currPosition)
    else if (char == "(") return Tokenizer.tokenizeOpenParen(lineNumber, currPosition)
    else if (char == ")") return Tokenizer.tokenizeCloseParen(lineNumber, currPosition)
    else if (char == "{") return Tokenizer.tokenizeOpenCurlyBrace(lineNumber, currPosition)
    else if (char == "}") return Tokenizer.tokenizeCloseCurlyBrace(lineNumber, currPosition)
    else if (char == "[") return Tokenizer.tokenizeOpenSquareBrace(lineNumber, currPosition)
    else if (char == "]") return Tokenizer.tokenizeCloseSquareBrace(lineNumber, currPosition)
    else if (char == "=") return Tokenizer.tokenizeWithEqual(str, lineNumber, currPosition)
    else if (char == ".") return Tokenizer.tokenizeDot(lineNumber, currPosition)
    else if (char == ":") return Tokenizer.tokenizeColon(lineNumber, currPosition)
    else if (char == "`") return Tokenizer.tokenizeString(str, lineNumber, currPosition)
    else if (char == "?") return Tokenizer.tokenizeQuestionMark(lineNumber, currPosition)
    else if (Tokenizer.isNumeric(charCode)) return Tokenizer.tokenizeNumber(str, lineNumber, currPosition)
    else if (Tokenizer.isAlphabetic(charCode)) return Tokenizer.tokenizeIdentifier(str, lineNumber, currPosition)
}

async function parseStyleXFile(fileName: string) {
    let lineNumber = 0
    const tokens: Tokenizer.TokenType[] = []

    await lineReader(fileName, handleLine)

    function handleLine(line: string) {
        lineNumber += 1
        for (let i = 0; i < line.length; ++i) {
            if (line.charAt(i) == " ") continue
            const token = tokenize(line, lineNumber, i)
            if (token) {
                if (token.type == "comment") return
                i += token.length - 1
                tokens.push(token)
            }
        }
    }

    console.log(tokens)

    return {}
}

function lineReader(fileName: string, readLine: (line: string) => void) {
    return new Promise((res, rej) => {
        const readInterface = readline.createInterface(fs.createReadStream(fileName))
        readInterface.on("line", data => {
            readLine(data)
        })
        readInterface.on("close", () => res())
        readInterface.on("SIGINT", () => rej())
    })
}

parseStyleXFile("./examples/Simple.stylex")
    .then(ast => console.log(ast))
    .catch(err => console.error(err))
