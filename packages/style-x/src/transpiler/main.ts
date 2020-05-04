import fs, { WriteStream } from "fs"
import path from "path"
import { performSemanticAnalysis } from "../sema/sema"

export const transpileProject = async (dir: string) => {
    const projectDir = path.resolve(".", dir)
    const outDir = path.resolve(".", "outdir")

    // find entry file
    const config = JSON.parse(fs.readFileSync(projectDir + "/stylex.config.json").toString())
    if (!config.entry) throw new Error("Invalid config file")
    const entry = config.entry as string
    const entryFile = path.resolve(dir, entry)

    const projectOutput = await performSemanticAnalysis(entryFile, projectDir, outDir)
    console.log(projectOutput)
}

// boilerplate for later

/*const writeStream = fs.createWriteStream(projectDir + "/dist/")

    const definitions = expressionArrayToObject(programAst.definitions)
    writeDefinitions(writeStream, definitions)
    if (programAst.component?.value?.value?.id == "variable_literal") {
        const varAst = programAst.component.value.value as VariableAST
        console.log(varAst.value?.fnCall?.value?.map(val => val.value!).map(val => val.value) || [])
        const exprs = expressionArrayToObject(varAst.value?.fnCall?.value?.map(val => val.value!) || [])

        writeStream.write(createComponent("Box", exprs))
    }
    writeStream.end()

const writeDefinitions = (writeStream: WriteStream, definitions: ObjectValue) => {
    writeStream.write(`import React from "react"\n\n`)
    writeStream.write(`const defaultValues = ${JSON.stringify(definitions).replace(/"/g, "")}\n`)
}
*/
