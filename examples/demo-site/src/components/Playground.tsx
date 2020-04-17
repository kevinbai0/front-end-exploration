import React from "react";
import { Box, styled } from "style-x";
import { DNA, ThemeExtension } from "../../../../dist/types/src/theme/types";
import { useEffect } from "react";
import { useRef } from "react";
import Artboard from "./Artboard";
import { getPos, getDim } from "../helpers";

interface Props extends DNA<ThemeExtension> {

}

export type Matrix = [number, number, number, number, number, number]
export type Point = {
    x: number, y: number
}

export type MouseMapper = {anchor: {x: number, y: number, scale: number}, calculate: (this: MouseMapper, {x, y}: Point) => Point}

function multPair(m1: Matrix, m2: Matrix): Matrix {
    return [m1[0] * m2[0], 0, 0, m1[3] * m2[3], m1[4] * m2[0] + m2[4], m1[5] * m2[3] + m2[5]]
}
function multMatrices(...matrices: Matrix[]): Matrix {
    return matrices.reduce((accum, matrix) => {
        return multPair(accum, matrix)
    }, [1,0,0,1,0,0] as Matrix)
}

const Playground: React.FC<Props> = ({children, ...dna}) => {
    const ref = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)
    const transformMatrix = useRef<Matrix>([1,0,0,1,0,0])
    const mouseMapper = useRef<MouseMapper>({
        anchor: {x: 0, y: 0, scale: 1},
        calculate: function({x,y}) {
            return { x: (x - this.anchor.x) / this.anchor.scale, y: (y - this.anchor.y) / this.anchor.scale}
        }})


    useEffect(() => {
        const midX = ref.current.offsetWidth / 2
        const midY = ref.current.offsetHeight / 2
        const left = ref.current.offsetLeft
        const top = ref.current.offsetTop
        const canvasDim = getDim(canvasRef.current)

        mouseMapper.current.anchor = {
            x: canvasDim.x,
            y: canvasDim.y,
            scale: 1
        }

        const scroll = (e: WheelEvent) => {
            const { x, y } = {
                x: e.clientX - left - midX, y: e.clientY - top - midY
            }
            const state = transformMatrix.current
            const ds = (() => {
                const val = Math.round(e.deltaY * 10) / 10 == e.deltaY ? 0 : -e.deltaY / 100
                if (val + state[0] > 4 || val + state[0] < 0.1) return 0
                return val
            })()

            const tx = -e.deltaX
            const ty = Math.round(e.deltaY * 10) / 10 == e.deltaY ? -e.deltaY : 0

            const scale = 1 + ds / state[0]

            const deltaMatrix: Matrix = [scale, 0, 0, scale, ds * (state[4] - x) / (state[0] * state[0]), ds * (state[5] - y) / (state[0] * state[0])]
            const finalMatrix = multMatrices(deltaMatrix, state, [1,0,0,1,tx,ty])
            canvasRef.current!.style.transform=`matrix(${finalMatrix.join(",")})`

            mouseMapper.current.anchor = {
                x: canvasDim.x + finalMatrix[4] + (canvasDim.width / 2) * (1 - finalMatrix[0]),
                y: canvasDim.y + finalMatrix[5] + (canvasDim.height / 2) * (1 - finalMatrix[0]),
                scale: finalMatrix[0]
            }

            transformMatrix.current = finalMatrix
        }
        ref.current?.addEventListener("mousewheel", scroll)

        return () => ref.current?.removeEventListener("mousewheel", scroll)
    })

    return (
        <Container bg="grey.2" align="start" {...dna} ref={ref}>
            <Box position="absolute" width="100%" height="100%" ref={canvasRef} bg="action">
                <Artboard bg="background" width={1200} height={800} mt={100} ml={100} mouseMapper={mouseMapper} />
            </Box>
        </Container>
    )
}

export default Playground

const Container = styled(Box)`
    overflow: hidden;
`