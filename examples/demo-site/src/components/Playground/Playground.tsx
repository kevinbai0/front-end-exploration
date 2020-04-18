import React from "react";
import { Box, styled } from "style-x";
import { DNA, ThemeExtension } from "../../../../../dist/types/src/theme/types";
import { useEffect } from "react";
import { useRef } from "react";
import Artboard from "./Artboard";
import { getDim } from "../../helpers";
import { Matrix, MouseMapper } from "../../utils/types";
import usePersepectiveTransform from "../../hooks/usePersepectiveTransform";

interface Props extends DNA<ThemeExtension> {

}

const Playground: React.FC<Props> = ({children, ...dna}) => {
    const ref = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    const { mouseMapper } = usePersepectiveTransform(ref, canvasRef)

    return (
        <Container bg="grey.2" align="start" {...dna} ref={ref}>
            <Box position="absolute" width="100%" height="100%" ref={canvasRef}>
                <Artboard bg="background" width={1200} height={800} mt={100} ml={100} mouseMapper={mouseMapper} />
            </Box>
        </Container>
    )
}

export default Playground

const Container = styled(Box)`
    overflow: hidden;
`