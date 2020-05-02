import { runnableStream } from "../index"
import { ProgramAST } from "../lang/definitions"
import fs from "fs"
import { ObjectValue, expressionArrayToObject } from "./values"

const getAst = (fileName: string) => {
    return new Promise<ProgramAST>((res, rej) => {
        const stream = runnableStream(fileName)

        stream.on("close", (data: ProgramAST) => {
            res(data)
        })

        stream.on("error", err => rej(err))
    })
}

const substitution = (ast: ProgramAST) => {
    const definitions = expressionArrayToObject(ast.definitions)
}

export const transpileProgram = async (path: string, fileName: string) => {
    const programAst = await getAst(path + fileName)
    const definitions = expressionArrayToObject(programAst.definitions)
    writeDefinitions(fileName, definitions)
}

const writeDefinitions = (fileName: string, definitions: ObjectValue) => {
    const writeStream = fs.createWriteStream(`./src/outdir/${fileName}.ts`)

    writeStream.write(`import React from "react"\n\n`)
    writeStream.write(`const defaultValues = ${JSON.stringify(definitions).replace(/"/g, "")}\n`)
    writeStream.end()
}
