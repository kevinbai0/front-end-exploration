import path from "path"
import { createFolderTree, FolderTree, searchModule } from "./modules"
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
    moduleName: string
    ast: ProgramAST
    folders: ProjectOutput[]
}

export type KVExprObject = { [key: string]: KeyValueExpressionAST }

export const performSemanticAnalysis = async (entryFile: string, projectDir: string, outDir: string) => {
    // load all folders into a tree
    const projectTree = await createFolderTree(projectDir)

    const entryModule = entryFile
        .split("/")
        .slice(-1)[0]
        .replace(".stylex", "")

    return await analyseFile(entryModule, path.relative(projectDir, entryFile), projectDir, outDir, projectTree)
}

const analyseFile = async (
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

            const transpiled = await analyseFile(module.moduleName, path.relative(rootDir, module.path), rootDir, outDir, projectTree, memo)
            memo[moduleName] = transpiled
            return {
                ...proj,
                folders: [...proj.folders, transpiled]
            }
        },
        new Promise<ProjectOutput>(res => res(outTree))
    )

    // perform substitution and find errors
    substitution(programAst, memo)

    return newStructure
}
