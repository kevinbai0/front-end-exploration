import React from "react";
import { DNA } from "../../../../src/theme/types";
import { useState } from "react";
import Resizable from "./Resizable";

interface Props extends DNA {

}
const RightUtilities: React.FC<Props> = ({children, ...dna}) => {
    const [ width, setWidth ] = useState(300)
    return (
        <Resizable constraints={{minWidth: 100, maxWidth: 400}}>
            Hello
        </Resizable>
    )
}

export default RightUtilities