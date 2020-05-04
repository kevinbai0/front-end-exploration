import path from "path"
import { createFolderTree, FolderTree, searchModule, File } from "./modules"
import { ProgramAST, KeyValueExpressionAST } from "../lang/definitions"
import { runnableStream } from "../index"
import { substitution } from "./substitution"

const generateAst = (dir: string) => {
    return new Promise<ProgramAST>((res, rej) => {
        const stream = runnableStream(dir)

        stream.on("close", (data: ProgramAST) => {
            res(data)
        })

        stream.on("error", err => rej(err))
    })
}

export type ProjectOutput = {
    pathName: string
    file: File
    ast: ProgramAST
    folders: ProjectOutput[]
}

export type KVExprObject = { [key: string]: KeyValueExpressionAST }

export const performSemanticAnalysis = async (entryFile: string, projectDir: string, outDir: string) => {
    // load all folders into a tree
    const projectTree = await createFolderTree(projectDir)

    const entryName = entryFile
        .split("/")
        .slice(-1)[0]
        .replace(".stylex", "")

    const entryModule = searchModule(projectTree, entryName)
    if (!entryModule) throw new Error(`Couldn't find module "${entryName}" in project.`)

    return await analyseFile(entryModule, path.relative(projectDir, entryFile), projectDir, outDir, projectTree)
}

const analyseFile = async (
    file: File,
    relPath: string,
    rootDir: string,
    outDir: string,
    projectTree: FolderTree,
    memo: { [key: string]: ProjectOutput } = {} // memo for circular dependencies
): Promise<{ project: ProjectOutput; memo: { [key: string]: ProjectOutput } }> => {
    const programAst = await generateAst(path.join(rootDir, relPath))

    const outTree: ProjectOutput = {
        pathName: path.join(outDir, relPath),
        file,
        ast: programAst,
        folders: []
    }

    memo[file.moduleName] = outTree
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

            const transpiled = await analyseFile(module, path.relative(rootDir, module.path), rootDir, outDir, projectTree, memo)
            memo[moduleName] = transpiled.project
            return {
                ...proj,
                folders: [...proj.folders, transpiled.project]
            }
        },
        new Promise<ProjectOutput>(res => res(outTree))
    )

    // perform substitution and find errors
    substitution(programAst, memo)

    return {
        project: newStructure,
        memo
    }
}
