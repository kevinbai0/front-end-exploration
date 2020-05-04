// async/await methods for simple fs actions

import fs from "fs"

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

export const dirExists = (dir: string) => {
    return new Promise<boolean>(resolve => {
        fs.exists(dir, exists => {
            resolve(exists)
        })
    })
}

export const createDir = (dir: string) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) reject(err)
            resolve()
        })
    })
}
