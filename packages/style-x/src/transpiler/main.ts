import { runnableStream } from "../index"
import { ProgramAST, VariableAST } from "../lang/definitions"
import fs, { WriteStream } from "fs"
import { ObjectValue, expressionArrayToObject } from "./values"
import { createComponent } from "./components"

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

    const writeStream = fs.createWriteStream(`./outdir/${fileName}.tsx`)

    const definitions = expressionArrayToObject(programAst.definitions)
    writeDefinitions(writeStream, definitions)
    if (programAst.component?.value?.value?.id == "variable_literal") {
        const varAst = programAst.component.value.value as VariableAST
        console.log(varAst.value?.fnCall?.value?.map(val => val.value!).map(val => val.value) || [])
        const exprs = expressionArrayToObject(varAst.value?.fnCall?.value?.map(val => val.value!) || [])

        writeStream.write(createComponent("Box", exprs))
    }
    writeStream.end()
}

const writeDefinitions = (writeStream: WriteStream, definitions: ObjectValue) => {
    writeStream.write(`import React from "react"\n\n`)
    writeStream.write(`const defaultValues = ${JSON.stringify(definitions).replace(/"/g, "")}\n`)
}
