import { StyleX, createLayout } from "./withStyleX"

import AlignmentType = StyleX.AlignmentType
import LayoutProps = StyleX.LayoutProps

export const fill = () => "fill"
export const auto = () => "auto"
export const row = (props: { align?: AlignmentType; justify?: AlignmentType }): LayoutProps =>
    createLayout({
        type: "row",
        ...props
    })

export const col = (props: { align?: AlignmentType; justify?: AlignmentType }): LayoutProps =>
    createLayout({
        type: "column",
        ...props
    })
