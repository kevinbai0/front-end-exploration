import fs, { WriteStream, writeSync, write } from "fs"
import path from "path"
import { performSemanticAnalysis, ProjectOutput } from "../sema/sema"
import { createDir, dirExists } from "../utils/fs"

const toOutDir = (dirInProject: string, projectDir: string, outDir: string) => {
    return path.join(outDir, path.relative(projectDir, dirInProject))
}

export const transpileProject = async (dir: string) => {
    const projectDir = path.resolve(".", dir)

    const outDir = path.resolve(".", "outdir")

    // find entry file
    const config = JSON.parse(fs.readFileSync(projectDir + "/stylex.config.json").toString())
    if (!config.entry) throw new Error("Invalid config file")
    const entry = config.entry as string
    const entryFile = path.resolve(dir, entry)

    const { project, memo } = await performSemanticAnalysis(entryFile, projectDir, outDir)

    // if root outdir doesn't exist let's make it
    const exists = await dirExists(path.join(outDir, "src"))
    if (!exists) await createDir(path.join(outDir, "src"))
    // make entry
    transpileFile(project, projectDir, outDir, memo)
}

const transpileFile = async (execFile: ProjectOutput, projectDir: string, outDir: string, memo: { [key: string]: ProjectOutput }) => {
    const fileOutDir = toOutDir(execFile.file.dir, projectDir, outDir)

    // create output file directory if doesn't exist
    if (!(await dirExists(fileOutDir))) await createDir(fileOutDir)
    const writeStream = fs.createWriteStream(execFile.pathName + ".ts")

    // import react if needed
    if (execFile.ast.component) writeStream.write(`import React from "react"\n`)

    const imports = execFile.ast.imports.map(imp => {
        const moduleName = imp.fromModule.value.replace(/`/g, "")
        const memod = memo[moduleName]
        if (imp.value.length == 1 && imp.value[0].value == moduleName)
            return {
                modules: moduleName,
                path: path.relative(fileOutDir, memod.pathName)
            }
        return {
            modules: imp.value.map(mod => mod.value),
            path: path.relative(fileOutDir, memod.pathName)
        }
    })

    imports.forEach(imp => {
        if (typeof imp.modules == "string") writeStream.write(`import ${imp.modules} from "${imp.path}"\n`)
        else writeStream.write(`import { ${imp.modules.join(", ")} } from "${imp.path}"\n`)
    })

    writeStream.end()
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
