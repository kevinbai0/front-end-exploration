import { ProjectOutput } from "../sema/sema"
import { VariableAST } from "../lang/definitions"
import { StyleX } from "../modules/withStyleX"
import { Value } from "../transpiler/values"

type CalculableDimension = number | string

interface Component {
    layout: StyleX.LayoutProps
    size: StyleX.SizeProps
    otherProps?: Value
    children: Component[]
    backwardCalculator: (dim: CalculableDimension) => number
}

export const useLayoutEngine = (projectDir: ProjectOutput) => {
    const rootComponent = projectDir.ast.component?.value!.value as VariableAST
    if (rootComponent.id != "variable_literal") {
        throw new Error(
            `Expected root component to be a variable but instead found ${rootComponent.id}`
        )
    }
    const rootConvertedComponent: Component = {
        layout: {
            type: "row",
            align: "start",
            justify: "start"
        },
        size: ["fill"],
        children: []
    }
}

// build out component AST
