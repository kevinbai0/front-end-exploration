import fs from "fs"
import path from "path"
import { performSemanticAnalysis, ProjectOutput } from "../sema/sema"
import { createDir, dirExists } from "../utils/fs"
import { valueAstToObject, writeValue } from "./value"
import { extractTypeFromValue } from "./type"
import { ValueAST, VariableAST } from "../lang/definitions"
import { writeComponent } from "./components"

export const moduleMethods = {
    row: true,
    col: true,
    fill: true
}

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

const transpileFile = async (
    execFile: ProjectOutput,
    projectDir: string,
    outDir: string,
    memo: { [key: string]: ProjectOutput }
) => {
    const fileOutDir = toOutDir(execFile.file.dir, projectDir, outDir)

    // create output file directory if doesn't exist
    if (!(await dirExists(fileOutDir))) await createDir(fileOutDir)
    const isTsx = !!execFile.ast.component
    const ext = isTsx ? ".tsx" : ".ts"
    const writeStream = fs.createWriteStream(execFile.pathName + ext, {
        flags: "w"
    })

    const mappedDefinitions = execFile.ast.definitions.reduce(
        (accum, definition) => ({
            ...accum,
            [definition.identifier]: definition.value!
        }),
        {} as Record<string, ValueAST>
    )

    const mappedOverridables = execFile.ast.definitions
        .filter(val => val.overridable)
        .reduce(
            (accum, definition) => ({
                ...accum,
                [definition.identifier]: definition.value!
            }),
            {} as Record<string, ValueAST>
        )

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
        if (typeof imp.modules == "string")
            writeStream.write(`import ${imp.modules} from "${imp.path}"\n`)
        else writeStream.write(`import { ${imp.modules.join(", ")} } from "${imp.path}"\n`)
    })

    writeStream.write("\n")

    execFile.ast.definitions
        .filter(expAst => !expAst.overridable)
        .forEach(expAst => {
            const variableName = expAst.identifier
            const value = valueAstToObject(expAst.value!, { moduleMethods })

            writeStream.write(`const ${variableName} = ${writeValue(value)};\n`)
        })

    writeStream.write("\n")

    // transpile exports
    execFile.ast.exports.forEach(expAst => {
        const variableName = expAst.identifier
        const value = valueAstToObject(expAst.value!, { moduleMethods })

        writeStream.write(`export const ${variableName} = ${writeValue(value)};\n`)
    })

    if (execFile.ast.component) {
        writeStream.write(`interface Props {\n`)
        const props = execFile.ast.definitions
            .filter(def => def.overridable)
            .map(exprAst => {
                return {
                    identifier: exprAst.identifier,
                    type: extractTypeFromValue(exprAst.value!)
                }
            })
            .filter(val => val.type)

        writeStream.write(props.map(value => `${value.identifier}?: ${value.type!}`).join("\n"))
        writeStream.write("\n}\n\n")

        // write component
        const componentName = execFile.file.moduleName
        const spreadProps = props.map(value => value.identifier).join(", ")
        const fallback = `${props
            .map(
                prop =>
                    `const $${prop.identifier} = ${prop.identifier} || ${writeValue(
                        valueAstToObject(mappedDefinitions[prop.identifier], {
                            moduleMethods
                        })
                    )}`
            )
            .join(";")}`

        const component = `return ${writeComponent(
            execFile.ast.component!.value!.value! as VariableAST,
            mappedOverridables
        )}`

        writeStream.write(
            `const ${componentName}: React.FC<Props> = ({${spreadProps}}) => {\n${fallback}${
                fallback.length ? ";" : ""
            }${component}\n}\n`
        )
        writeStream.write(`\nexport default ${componentName}`)
    }

    writeStream.end()

    // transpile the rest of the files
    execFile.folders.forEach(folder => {
        transpileFile(folder, projectDir, outDir, memo)
    })
}
