import React from "react";
import { Box, styled } from "style-x"
import { DNA, ThemeExtension } from "../../../../dist/types/src/theme/types";
import { MutableRefObject } from "react";
import ComponentTreeRenderer from "./ComponentTreeRenderer";
import useArtboardLogic from "../hooks/useArtboardLogic";
import { MouseMapper, EditMode } from "../utils/types";

interface Props extends DNA<ThemeExtension> {
    mouseMapper: MutableRefObject<MouseMapper>
}

const CursorBox = styled(Box)<{editMode: EditMode}>`
    cursor: ${props => props.editMode == "box" ? "cell" : "default"};
`

const Artboard: React.FC<Props> = ({children, mouseMapper, ...dna}) => {
    const { artboardRef, drawBoxRef, editMode, active, setActive, components } = useArtboardLogic(mouseMapper)

    return (
        <CursorBox {...dna} ref={artboardRef} editMode={editMode}>
            <ComponentTreeRenderer components={components} active={active} setActive={setActive}/>
            <Box ref={drawBoxRef} position="absolute" border="ghost"/>
        </CursorBox>
    )
}

export default Artboard