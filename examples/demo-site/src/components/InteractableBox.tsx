import React, { useRef } from "react";
import { Box, styled } from "style-x"
import { DNA } from "../../../../dist/types/src/theme/types";
import useInteractable from "../hooks/useInteractable";
import { MutableRefObject } from "react";

interface Props extends DNA {
    componentDNA: DNA
    active: string
    setActive?: (id: string) => void
    id: string
}

const InteractableBox: React.FC<Props> = ({children, componentDNA, active, setActive, id, ...dna}) => {
    const drawBoxRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

    useInteractable(drawBoxRef, [active], { x: 0, y: 0, offsetX: 0, offsetY: 0 })
        .shouldStart(() => {
            setActive && setActive(id)
            return true
        })
        .onStart(({e, ref}) => {
          
        })
        .onUpdate(({e, state}) => {
            console.log("update")
        })
        .onEnd(({e, state, ref}) => {
            
        })

    return (
        <InteractiveBox ref={drawBoxRef} {...dna} active={active == id}>
            <Box width="fill" height="fill" {...componentDNA}>
                {children}
            </Box>
            {active == id && (
                <>
                    <EditDot width={10} height={10} left={-7} top={-7} bg="background" />
                    <EditDot width={10} height={10} right={-7} top={-7} bg="background" />
                    <EditDot width={10} height={10} left={-7} bottom={-7} bg="background" />
                    <EditDot width={10} height={10} right={-7} bottom={-7} bg="background" />
                </>
            )}
        </InteractiveBox>
    )
}

export default InteractableBox

const InteractiveBox = styled(Box)<{active: boolean}>`
    ${props => props.active && `border: 1px solid ${props.theme.colors.action};`};
`

const EditDot = styled(Box)`
    position: absolute;
    border: 2px solid ${props => props.theme.colors.action};
    border-radius: 10px;
`