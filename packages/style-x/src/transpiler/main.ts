import { runnableStream } from "../index"
import { ProgramAST } from "../lang/definitions"
import fs, { WriteStream } from "fs"
import path from "path"
import { ObjectValue, expressionArrayToObject } from "./values"
import { searchModule, createFolderTree } from "./modules"

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

export const transpileProject = async (dir: string) => {
    const projectDir = path.resolve(".", dir)

    // find entry file
    const config = JSON.parse(fs.readFileSync(projectDir + "/stylex.config.json").toString())
    if (!config.entry) throw new Error("Invalid config file")
    const entry = config.entry as string

    // load all files
    const projectTree = await createFolderTree(projectDir)

    const entryFile = path.resolve(dir, entry)
    const programAst = await getAst(entryFile)

    // get imports
    programAst.imports.forEach(async imp => {
        const moduleName = imp.fromModule.value.replace(/`/g, "")
        console.log(searchModule(projectTree, moduleName))
    })
    /*const writeStream = fs.createWriteStream(projectDir + "/dist/")

    const definitions = expressionArrayToObject(programAst.definitions)
    writeDefinitions(writeStream, definitions)
    if (programAst.component?.value?.value?.id == "variable_literal") {
        const varAst = programAst.component.value.value as VariableAST
        console.log(varAst.value?.fnCall?.value?.map(val => val.value!).map(val => val.value) || [])
        const exprs = expressionArrayToObject(varAst.value?.fnCall?.value?.map(val => val.value!) || [])

        writeStream.write(createComponent("Box", exprs))
    }
    writeStream.end()*/
}

const writeDefinitions = (writeStream: WriteStream, definitions: ObjectValue) => {
    writeStream.write(`import React from "react"\n\n`)
    writeStream.write(`const defaultValues = ${JSON.stringify(definitions).replace(/"/g, "")}\n`)
}
