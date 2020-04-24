import React from "react";
import { Box, styled } from "../../../design-system"
import { DNA, ThemeExtension } from "../../../design-system/src/theme/types";
import { MutableRefObject } from "react";
import ComponentTreeRenderer from "./ComponentTreeRenderer";
import useArtboardLogic from "../../hooks/useArtboardLogic";
import { MouseMapper, EditState } from "../../utils/types";

interface Props extends DNA<ThemeExtension> {
    mouseMapper: MutableRefObject<MouseMapper>
}

const CursorBox = styled(Box)<{editState: EditState}>`
    cursor: ${props => props.editState.mode.type == "box" ? "cell" : "default"};
`

const Artboard: React.FC<Props> = ({children, mouseMapper, ...dna}) => {
    const { artboardRef, drawBoxRef, editState, components, componentsStore } = useArtboardLogic(mouseMapper)
    return (
        <CursorBox {...dna} ref={artboardRef} editState={editState}>
            <ComponentTreeRenderer components={components} active={editState.selected} store={componentsStore}/>
            <Box ref={drawBoxRef} position="absolute" border="ghost"/>
        </CursorBox>
    )
}

export default Artboard