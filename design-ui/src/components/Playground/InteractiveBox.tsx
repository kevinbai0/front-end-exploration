import React, { useRef } from "react";
import { Box, styled } from "style-x"
import { DNA, ThemeExtension } from "../../../../../dist/types/src/theme/types";
import useInteractive from "../../hooks/useInteractive";
import { MutableRefObject } from "react";
import { getPos } from "../../helpers";
import { RenderableComponentProps, StyleSetterRef } from "./ComponentTreeRenderer"
import { useEffect } from "react";

export interface InteractiveBoxProps extends RenderableComponentProps {
    componentDNA: DNA<ThemeExtension>
}

const InteractiveBox: React.FC<InteractiveBoxProps> = ({children, componentDNA, active, setRef, id, ...dna}) => {
    const drawBoxRef = useRef<HTMLDivElement>(null)

    function getDim(key: "left" | "width" | "top" | "height") {
        if (!drawBoxRef.current) return 0
        if (drawBoxRef.current.style[key].length <= 2) return 0
        const value = parseFloat(drawBoxRef.current.style[key].slice(0, -2))
        if (value == NaN) return 0
        return value
    }

    const styleSetRef = useRef<StyleSetterRef>({
        left: () => getDim("left"),
        top: () => getDim("top"),
        width: () => getDim("width"),
        height: () => getDim("height"),
        setDimensions: function({x, y, width, height}) {
            if (!drawBoxRef.current) return
            drawBoxRef.current.style.left = x + "px"
            drawBoxRef.current.style.top = y + "px"
            drawBoxRef.current.style.width = width + "px"
            drawBoxRef.current.style.height = height + "px"
        },
        getDimensions: function() {
            return {
                x: this.left(),
                y: this.top(),
                width: this.width(),
                height: this.height()
            }
        }
    })

    useEffect(() => {
        styleSetRef.current.setDimensions({
            x: typeof(dna.left) == "number" ? dna.left : 0,
            y: typeof(dna.top) == "number" ? dna.top : 0,
            width: typeof(dna.width) == "number" ? dna.width : 0,
            height: typeof(dna.height) == "number" ? dna.height : 0
        })
        setRef(styleSetRef)
    }, [])

    return (
        <Box ref={drawBoxRef} {...dna} border={active.includes(id) ? "action" : "none"}>
            <Box width="fill" height="fill" {...componentDNA}>
                {children}
            </Box>
            {active.includes(id) && (
                <>
                    <EditDot width={10} height={10} left={-7} top={-7} bg="background" />
                    <EditDot width={10} height={10} right={-7} top={-7} bg="background" />
                    <EditDot width={10} height={10} left={-7} bottom={-7} bg="background" />
                    <EditDot width={10} height={10} right={-7} bottom={-7} bg="background" />
                </>
            )}
        </Box>
    )
}

export default InteractiveBox

const EditDot = styled(Box)`
    position: absolute;
    border: 2px solid ${props => props.theme.colors.action};
    border-radius: 10px;
`