import { useEffect, MutableRefObject, useRef } from "react"
import { EventListener, LifeCycle, LifeCycleMethod, EventMethod } from "../utils/types"

export default function<T, S extends HTMLElement>(
    ref: React.MutableRefObject<S | null>,
    diff: any[],
    state: T, 
) {
    const appState = useRef(state)

    const eventListeners: MutableRefObject<EventListener<S>[]> = useRef([])
    const lifeCycleActions: MutableRefObject<LifeCycle<S>[]> = useRef([])
    eventListeners.current = []
    lifeCycleActions.current = []

    // TODO: batch all window methods so no excess event listeners are created (dunno if this is a good idea tho)
    useEffect(() => {
        const curr = ref.current

        // reduce the eventlisteners and lifecycle methods by key
        const reduced = eventListeners.current.reduce((accum, listener) => {
            accum[listener.event].push(listener)
            return accum
        }, { mousedown: [], mousemove: [], mouseup: [] } as { [key in EventListener<S>["event"]]: EventListener<S>[]})

        const lifeCycles = lifeCycleActions.current.reduce((accum, listener) => {
            accum[listener.event].push(listener)
            return accum
        }, { "should-start": [] } as { [key in LifeCycle<S>["event"]]: LifeCycle<S>[]})
    
        // for each mousedown, mousemove, and mouseup, apply all the lifecycle/eventlistener methods
        const mousedown = (e: MouseEvent) => {
            if (!curr) return
            if (lifeCycles["should-start"].filter(ev => !ev.method(e, curr)).length > 0) return
            curr?.setAttribute("down", "true")

            reduced.mousedown.forEach(ev => ev.method(e, curr))
        }

        const mousemove = (e: MouseEvent) => {
            if (!curr?.getAttribute("down") || !ref.current) return
            reduced.mousemove.forEach(ev => ev.method(e, curr))
        }

        const mouseup = (e: MouseEvent) => {
            if (!curr?.getAttribute("down")) return
            curr?.setAttribute("down", "")
            if (!curr) return
            reduced.mouseup.forEach(ev => ev.method(e, curr))
        }

        curr?.addEventListener("mousedown", mousedown)
        window.addEventListener("mousemove", mousemove)
        window.addEventListener("mouseup", mouseup)

        return () => {
            curr?.removeEventListener("mousedown", mousedown)
            window.removeEventListener("mousemove", mousemove)
            window.removeEventListener("mouseup", mouseup)
        }
    }, [ref, diff])

    // return these methods to be chained together by useInteractive
    const returnObj = {
        onStart, onUpdate, onEnd, shouldStart, updateState
    }

    // defined lifecycle and event methods

    function shouldStart(fn: LifeCycleMethod<T, S, boolean>) {
        lifeCycleActions.current.push({
            event: "should-start",
            method: (e: MouseEvent, ref: S) => fn({e, ref, state: appState.current})
        })

        return returnObj
    }

    function onStart(fn: EventMethod<T, S>) {
        eventListeners.current.push({ 
            event: "mousedown",
            method: (e: MouseEvent, ref: S) => {
                const startState = fn({e, ref, state: appState.current})
                if (startState) appState.current = startState
            } 
        })

        return returnObj
    }

    function onUpdate(fn: EventMethod<T, S>) {
        eventListeners.current.push({
            event: "mousemove",
            method: (e: MouseEvent, ref: S) => {
                const updateState = fn({e, ref, state: appState.current})
                if (updateState) appState.current = updateState
            }
        })

        return returnObj
    }

    function onEnd(fn: EventMethod<T, S>) {
        eventListeners.current.push({ 
            event: "mouseup",
            method: (e: MouseEvent, ref: S) => {
                const endState = fn({e, ref, state: appState.current})
                if (endState) appState.current = endState
            }
        })

        return returnObj
    }

    function updateState(state: Partial<T>) {
        appState.current = { ...appState.current, ...state }
    }

    return returnObj
}

