export const getPos = (elem: HTMLElement, x: number = 0, y: number = 0): {x: number, y: number} => {
    if (elem.parentElement) return getPos(elem.parentElement, elem.offsetLeft + x, elem.offsetTop + y)
    return {
        x: elem.offsetLeft + x,
        y: elem.offsetTop + y
    }
}