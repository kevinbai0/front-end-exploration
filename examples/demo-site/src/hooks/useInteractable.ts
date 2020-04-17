import { useEffect, MutableRefObject, useRef } from "react"

export type EventMethod<T, S extends HTMLElement> = (props: { e: MouseEvent, ref: S, state: T }) => T | undefined | void
type EventListener<S> = {
    event: "mousedown" | "mouseup" | "mousemove"
    method: (e: MouseEvent, ref: S) => void
}

type LifeCycleMethod<T, S extends HTMLElement, R> = (props: { e: MouseEvent, ref: S, state: T}) => R
type LifeCycle<S> = {
    event: "should-start",
    method: (e: MouseEvent, ref: S) => boolean
}


let windowListeners: any[] = []

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

    useEffect(() => {
        const curr = ref.current
        const reduced = eventListeners.current.reduce((accum, listener) => {
            accum[listener.event].push(listener)
            return accum
        }, { mousedown: [], mousemove: [], mouseup: [] } as { [key in EventListener<S>["event"]]: EventListener<S>[]})

        const lifeCycles = lifeCycleActions.current.reduce((accum, listener) => {
            accum[listener.event].push(listener)
            return accum
        }, { "should-start": [] } as { [key in LifeCycle<S>["event"]]: LifeCycle<S>[]})
    
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

        function mouseup(e: MouseEvent) {
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

    const returnObj = {
        onStart, onUpdate, onEnd, shouldStart, updateState
    }

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

