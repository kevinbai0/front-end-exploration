import React from "react";
import { Box, styled } from "../../design-system";
import { DNA, ThemeExtension } from "../../design-system/src/theme/types";
import { useRef } from "react";
import Artboard from "./Artboard";
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