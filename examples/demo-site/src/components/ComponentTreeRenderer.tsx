import React from "react";
import { Box } from "style-x"
import { DNA } from "../../../../dist/types/src/theme/types";

interface RenderComponent<T extends DNA & {active: string}> {
    id: string
    component: {
        type: "component",
        fn: React.FC<T>,
        props: T
    } | {
        type: "tree",
        fn: RenderComponents
    }
}

export type RenderComponents = RenderComponent<any>[]

interface Props extends DNA {
    components: RenderComponents
    active: string
    setActive: (id: string) => void
}

const ComponentTreeRenderer: React.FC<Props> = ({children, components, active, setActive, ...dna}) => {
    return (
        <Box {...dna}>
            {components.map((component) => {
                if (component.component.type == 'component') {
                    return <component.component.fn key={component.id} {...component.component.props} active={active} setActive={setActive} />
                }
                return <ComponentTreeRenderer components={component.component.fn} active={active} setActive={setActive} />
            })}
        </Box>
    )
}

export default ComponentTreeRenderer