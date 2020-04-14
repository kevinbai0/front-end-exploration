import { useEffect, MutableRefObject } from "react"

type EventMethod<T, S extends HTMLElement> = (e: MouseEvent, ref: S, state?: T) => T | undefined | void
type EventListener<S> = {
    event: "mousedown" | "mouseup" | "mousemove"
    method: (e: MouseEvent, ref: S) => void
}

export default function<T, S extends HTMLElement>(
    ref: React.MutableRefObject<S | null>,
    state?: T, 
) {
    let appState = state

    let eventListeners: EventListener<S>[] = []

    useEffect(() => {        
        const reduced = eventListeners.reduce((accum, listener) => {
            accum[listener.event].push(listener)
            return accum
        }, { mousedown: [], mousemove: [], mouseup: [] } as { [key in "mousedown" | "mousemove" | "mouseup"]: EventListener<S>[]})
    
        const mousedown = (e: MouseEvent) => {
            ref.current?.setAttribute("down", "true")
            if (!ref.current) return
            
            reduced.mousedown.forEach(ev => ev.method(e, ref.current!))
        }

        const mousemove = (e: MouseEvent) => {
            if (!ref.current?.getAttribute("down") || !ref.current) return
            reduced.mousemove.forEach(ev => ev.method(e, ref.current!))
        }

        const mouseup = (e: MouseEvent) => {
            ref.current?.setAttribute("down", "")
            if (!ref.current) return
            reduced.mouseup.forEach(ev => ev.method(e, ref.current!))
        }

        ref.current?.addEventListener("mousedown", mousedown)
        window.addEventListener("mousemove", mousemove)
        window.addEventListener("mouseup", mouseup)

        return () => {
            ref.current?.removeEventListener("mousedown", mousedown)
            window.removeEventListener("mousemove", mousemove)
            window.removeEventListener("mouseup", mouseup)
        }
    }, [ref.current])

    function onStart(fn: EventMethod<T, S>) {
        const method = (e: MouseEvent, ref: S) => {
            const startState = fn(e, ref, appState)
            if (startState) appState = startState
        }

        eventListeners.push({ 
            event: "mousedown",
            method 
        })

        return {
            onStart, onUpdate, onEnd
        }
    }

    function onUpdate(fn: EventMethod<T, S>) {
        const method = (e: MouseEvent, ref: S) => {
            const updateState = fn(e, ref, appState)
            if (updateState) appState = updateState
        }
        eventListeners.push({ 
            event: "mousemove",
            method 
        })
        
        return {
            onStart, onUpdate, onEnd
        }
    }

    function onEnd(fn: EventMethod<T, S>) {
        const method = (e: MouseEvent, ref: S) => {
            const endState = fn(e, ref, appState)
            if (endState) appState = endState
        }

        eventListeners.push({ 
            event: "mouseup",
            method 
        })

        return {
            onStart, onUpdate, onEnd
        }
    }

    return {
        onStart, onUpdate, onEnd
    }
}

