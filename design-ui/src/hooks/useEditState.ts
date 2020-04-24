import { useState, useRef } from "react";
import { EditState } from "../utils/types";

// we store the edit state in both ref and state so we can have a mutable state when we need fast changes

export default function() {
    const [ editState, setEditState ] = useState<EditState>({
        mode: {
            type: "select",
            value: "no-selection"
        },
        selected: []
    })

    const mutableEditState = useRef<EditState>(editState)

    function updateEditState(state: EditState) {
        setEditState(state)
        // copy to mutable state
        mutableEditState.current = {
            ...state,
            mode: {
                ...state.mode
            }
        }
    }

    function getEditState(): Readonly<EditState> {
        // return the mutable state since that's the most up to date
        return mutableEditState.current
    }


    // provide editstate for state changes but also getters and setters to interface with mutable edit state
    return {
        editState, getEditState, updateEditState
    }
}