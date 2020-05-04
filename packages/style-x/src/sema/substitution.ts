import { copyProgramAst } from "./copyAst"
import { ProgramAST, ExpressionAST, VariableAST, KeyValueExpressionAST, ValueAST } from "../lang/definitions"
import { globals } from "../lang/globals"
import { ProjectOutput, KVExprObject } from "./sema"

const findInMemos = (identifier: string, memos: KVExprObject[]) => {
    const found = memos.find(memo => memo[identifier])
    if (found) return found[identifier]
}

export const substitution = (programAst: ProgramAST, memo: { [key: string]: ProjectOutput }) => {
    const ast = copyProgramAst(programAst)

    // change imports to expressions
    const imports = ast.imports.reduce((accum, imp) => {
        const moduleName = imp.fromModule.value.replace(/`/g, "")
        const memod = memo[moduleName]
        const moduleProgramAst = memod.ast

        // if it is a import for a default module, it looks for a component
        if (imp.value.length == 1 && imp.value[0].value == moduleName) {
            if (!moduleProgramAst.component) throw new Error(`Expected module "${moduleName}" in "${memod.pathName}" to be a component but none was found`)
            if (accum[moduleName]) throw new Error(`Duplicate import module name found "${moduleName}"`)
            accum[moduleName] = {
                id: "key_value",
                identifier: moduleName,
                value: moduleProgramAst.component!.value
            }
            return accum
        }

        // convert exports into an object
        const exports = moduleProgramAst.exports.reduce((accum, exprAst) => {
            return {
                ...accum,
                [exprAst.identifier]: exprAst
            }
        }, {} as KVExprObject)

        // match imports to exports
        imp.value.forEach(mdAst => {
            if (!exports[mdAst.value]) throw new Error(`Could not find "${mdAst.value}" in ${moduleName} at ${memod.pathName}`)
            if (accum[mdAst.value]) throw new Error(`Duplicate import module name found "${mdAst.value}"`)
            accum[mdAst.value] = exports[mdAst.value]
        }, {} as KVExprObject)

        return accum
    }, {} as KVExprObject)

    // substitute definitions, actually should belong in semantic analysis
    const definitions = substituteKeyValueExpressions(ast.definitions, [imports])
    substituteKeyValueExpressions(ast.exports, [definitions, imports]) // exports
    // substitute
}

const substituteKeyValueExpressions = (exprs: KeyValueExpressionAST[], memos: KVExprObject[]) => {
    return exprs.reduce((accum, definition) => {
        const valueAst = definition.value!
        if (valueAst.value!.id == "variable_literal") {
            const variableAst = valueAst.value! as VariableAST
            accum[definition.identifier] = {
                ...definition,
                value: substituteVariable(variableAst, [accum, ...memos])
            }
            return accum
        }
        accum[definition.identifier] = definition
        return accum
    }, {} as KVExprObject)
}

const substituteVariable = (variableAst: VariableAST, memos: KVExprObject[]): ValueAST => {
    // find a match with imports or current definitions
    // see if it's a global first

    if (globals[variableAst.value!.identifiers[0]] == "function" && variableAst.value!.identifiers.length == 1 && variableAst.value?.fnCall) {
        // if it's a function, we can go on to substitution in function parameters
        return {
            id: "value_ast",
            lineNumber: variableAst.lineNumber,
            position: variableAst.position,
            value: variableAst
        }
    }

    const match = findInMemos(variableAst.value!.identifiers[0], memos)

    let currAst = match && match.value

    // if we couldn't find the variable as an import or before the definition, we can throw an error
    if (!currAst) throw new Error(`Variable not found "${variableAst.value!.identifiers[0]}" on line ${variableAst.lineNumber}:${variableAst.position}`)

    for (const identifier of variableAst.value!.identifiers.slice(1)) {
        // we look for property calls so currAst must be an object
        if (currAst.value?.id != "object_literal") {
            throw new Error(`Cannot access property of "${identifier}" for type ${currAst.id} on line ${variableAst.lineNumber}:${variableAst.position}`)
        }
        // look for identifier in object
        const foundValue: ExpressionAST | undefined = currAst.value.value?.find(expr => expr.value?.id == "key_value" && expr.value.identifier == identifier)
        if (foundValue) currAst = (foundValue.value as KeyValueExpressionAST).value!
        else {
            throw new Error(`Cannot access property of "${identifier}" for type ${currAst.id} on line ${variableAst.lineNumber}:${variableAst.position}`)
        }
        // if we found nothing then we have an error
    }
    // if we have function calls, then currAst needs to be a variable
    if (variableAst.value!.fnCall && currAst.value?.id != "variable_literal") {
        throw new Error(`Unexpected type ${currAst.value?.id} on line ${variableAst.lineNumber}:${variableAst.position}`)
    }
    if (variableAst.value!.fnCall) {
        // if variable is a function call, we need to do substitution on the function parameters
    }

    // we can now make the corresponding identifier change
    return currAst
}
/*
const substituteFunctionParameters = (variableAst: VariableAST, memos: KVExprObject[]): VariableAST => {
    //
    return {
        ...variableAst,
        value: {
            ...variableAst.value!,
            fnCall: {
                ...variableAst.value!.fnCall!,
                value: variableAst.value!.fnCall!.value!.map(param => substituteFunctionParameter(param, memos))
            }
        }
    }
}*/
