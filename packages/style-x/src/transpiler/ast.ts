import { ProgramAST } from "../lang/definitions"

export const copyProgramAst = (ast: ProgramAST) => {
    return {
        ...ast
    }
}
