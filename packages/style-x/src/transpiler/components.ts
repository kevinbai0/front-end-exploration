import { VariableAST, KeyValueExpressionAST, ArrayAST, ValueAST } from "../lang/definitions"
import { valueAstToObject, writeValue } from "./value"
import { moduleMethods } from "./main"

export const writeComponent = (
    variableAst: VariableAST,
    mappedDefinitions: Record<string, ValueAST>
): string | undefined => {
    if (!variableAst.value!.fnCall) return
    const identifier = variableAst.value!.identifiers.join(".")
    const params = variableAst
        .value!.fnCall.value!.map(param => {
            if (param.value?.value!.id == "key_value") {
                const keyVal = param.value?.value! as KeyValueExpressionAST
                return {
                    identifier: keyVal.identifier,
                    value: keyVal.value!
                }
            }
        })
        .filter(param => param?.value)

    const withoutChildren = params.filter(param => param?.identifier != "children")
    const children = params.find(param => param?.identifier == "children")

    const tagDefinition = `<${identifier} ${withoutChildren
        .map(param => {
            return `${param?.identifier}={${writeValue(
                valueAstToObject(param!.value, { mappedDefinitions, moduleMethods })
            )}}`
        })
        .join(" ")}`
    if (!children) return `${tagDefinition} />`

    if (children.value.value!.id == "variable_literal") {
        return `${tagDefinition}>\n${writeComponent(
            children.value!.value! as VariableAST,
            mappedDefinitions
        )}</${identifier}>`
    }
    if (children.value.value!.id == "array_literal") {
        return `${tagDefinition}>\n${(children.value!.value! as ArrayAST)
            .value!.map(value => {
                if (value.value!.id != "variable_literal")
                    throw new Error(
                        `Expected components but got ${children.value.value!.id} on line ${
                            children.value.lineNumber
                        }:${children.value.position}`
                    )

                return writeComponent(value.value as VariableAST, mappedDefinitions)
            })
            .join("\n")}\n</${identifier}>`
    }
    throw new Error(
        `Expected components but got ${children.value.value!.id} on line ${
            children.value.lineNumber
        }:${children.value.position}`
    )
}
