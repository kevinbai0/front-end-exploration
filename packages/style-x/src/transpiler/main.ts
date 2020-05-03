import { runnableStream } from "../index"
import { ProgramAST } from "../lang/definitions"
import fs, { WriteStream } from "fs"
import path from "path"
import { ObjectValue, expressionArrayToObject } from "./values"
import { searchModule, createFolderTree, FolderTree } from "./modules"

const generateAst = (dir: string) => {
    return new Promise<ProgramAST>((res, rej) => {
        const stream = runnableStream(dir)

        stream.on("close", (data: ProgramAST) => {
            res(data)
        })

        stream.on("error", err => rej(err))
    })
}

type ProjectOutput = {
    text: string
    pathName: string
    moduleName: string
    ast: ProgramAST
    folders: ProjectOutput[]
}

export const transpileProject = async (dir: string) => {
    const projectDir = path.resolve(".", dir)
    const outDir = path.resolve(".", "outdir")

    // find entry file
    const config = JSON.parse(fs.readFileSync(projectDir + "/stylex.config.json").toString())
    if (!config.entry) throw new Error("Invalid config file")
    const entry = config.entry as string

    // load all folders into a tree
    const projectTree = await createFolderTree(projectDir)

    const entryFile = path.resolve(dir, entry)
    const entryModule = entryFile
        .split("/")
        .slice(-1)[0]
        .replace(".stylex", "")

    console.log(await transpileFile(entryModule, path.relative(projectDir, entryFile), projectDir, outDir, projectTree))
}

const transpileFile = async (
    moduleName: string,
    relPath: string,
    rootDir: string,
    outDir: string,
    projectTree: FolderTree,
    memo: { [key: string]: ProjectOutput } = {} // memo for circular dependencies
): Promise<ProjectOutput> => {
    const programAst = await generateAst(path.join(rootDir, relPath))

    const outTree: ProjectOutput = {
        pathName: path.join(outDir, relPath),
        moduleName,
        text: "",
        ast: programAst,
        folders: []
    }

    memo[moduleName] = outTree
    // get imports
    const newStructure = await programAst.imports.reduce(
        async (accum, imp) => {
            const proj = await accum
            const moduleName = imp.fromModule.value.replace(/`/g, "")
            if (memo[moduleName])
                return {
                    ...proj,
                    folders: [...proj.folders, memo[moduleName]]
                }
            const module = searchModule(projectTree, moduleName)
            if (!module) throw new Error(`Couldn't find module "${moduleName}" in project.`)

            const transpiled = await transpileFile(module.moduleName, path.relative(rootDir, module.path), rootDir, outDir, projectTree, memo)
            memo[moduleName] = transpiled
            return {
                ...proj,
                folders: [...proj.folders, transpiled]
            }
        },
        new Promise<ProjectOutput>(res => res(outTree))
    )

    return newStructure
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
