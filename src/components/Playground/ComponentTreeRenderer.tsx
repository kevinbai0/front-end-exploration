import React from "react";
import { Box } from "../../../design-system"
import { DNA, ThemeExtension } from "../../../design-system/src/theme/types";
import { MutableRefObject } from "react";
import { LayoutDim } from "../../utils/types";

export interface StyleSetterRef {
    readonly left: () => number
    readonly top: () => number
    readonly width: () => number
    readonly height: () => number
    readonly setDimensions: (this: StyleSetterRef, dim: LayoutDim) => void
    readonly getDimensions: (this: StyleSetterRef) => LayoutDim
}

export interface RenderableComponentProps extends DNA<ThemeExtension> {
    id: string
    active?: string[], 
    setRef?: (ref: MutableRefObject<StyleSetterRef>) => void
}

export interface RenderComponent<T extends RenderableComponentProps> {
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

export type RenderComponents = RenderComponent<RenderableComponentProps>[]

interface Props extends DNA<ThemeExtension> {
    components: RenderComponents
    active: string[]
    store: MutableRefObject<ComponentStore>
}

export type ComponentStore = {
    [key: string]: {
        component: RenderComponent<RenderableComponentProps>,
        ref: MutableRefObject<StyleSetterRef>
    }
}

const ComponentTreeRenderer: React.FC<Props> = ({children, components, active, store, ...dna}) => {
    return (
        <Box {...dna}>
            {components.map((component) => {
                if (component.component.type == 'component') {
                    return (
                        <component.component.fn 
                            key={component.id} {...component.component.props} 
                            active={active}
                            setRef={(ref) => {
                                store.current[component.id] = { component, ref}
                            }}
                        />
                    )
                }
                return (
                    <ComponentTreeRenderer 
                        components={component.component.fn} 
                        active={active} 
                        store={store}
                    />
                )
            })}
        </Box>
    )
}

export default ComponentTreeRenderer