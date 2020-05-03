// async/await methods for simple fs actions

import fs from "fs"
import path from "path"

export const listDir = (path: string) => {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) return reject(err)
            resolve(files)
        })
    })
}

export const isDirectory = (dir: string) => {
    return new Promise<boolean>((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            if (err) return reject(err)
            resolve(stats.isDirectory())
        })
    })
}
