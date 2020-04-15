import React from "react";
import { Box, styled } from "style-x";
import { DNA, ThemeExtension } from "../../../../dist/types/src/theme/types";
import { useEffect } from "react";
import { useRef } from "react";
import Artboard from "./Artboard";

interface Props extends DNA<ThemeExtension> {

}
const Playground: React.FC<Props> = ({children, ...dna}) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const scroll = (e: WheelEvent) => {
            console.log(e)
        }
        ref.current?.addEventListener("mousewheel", scroll)

        return () => ref.current?.removeEventListener("mousewheel", scroll)
    })
    return (
        <Container bg="grey.2" {...dna} ref={ref}>
            <Artboard bg="background" width={1200} height={800} mt={100} ml={100}/>
        </Container>
    )
}

export default Playground

const Container = styled(Box)`
    overflow: hidden;
`