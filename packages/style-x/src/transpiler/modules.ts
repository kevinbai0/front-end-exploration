// find module
import path from "path"
import { listDir, isDirectory } from "../utils/fs"

export type File = {
    moduleName: string
    name: string
    path: string
}
export type FolderTree = {
    path: string
    folders: FolderTree[]
    files: File[]
}

export const searchModule = (tree: FolderTree, moduleName: string): File | undefined => {
    const found = tree.files.find(file => file.moduleName == moduleName)
    if (found) return found
    return tree.folders.map(folder => searchModule(folder, moduleName)).find(file => file)
}

export const createFolderTree = async (pathName: string, memo: { [key: string]: true } = {}): Promise<FolderTree> => {
    const files = await listDir(pathName)
    const tree: FolderTree = {
        files: [],
        folders: [],
        path: pathName
    }

    return files.reduce(
        async (accum, file) => {
            const newPath = path.join(pathName, file)
            const isDir = await isDirectory(newPath)
            const currTree = await accum
            if (isDir)
                return {
                    ...currTree,
                    folders: [...currTree.folders, await createFolderTree(newPath, memo)]
                }
            if (file.indexOf(".stylex") == file.length - ".stylex".length) {
                const newFile = createFile(pathName, file)
                if (memo[newFile.moduleName]) throw new Error(`More than one module with name "${newFile.moduleName}" was found`)
                memo[newFile.moduleName] = true
                return {
                    ...currTree,
                    files: [...currTree.files, newFile]
                }
            }
            return accum
        },
        new Promise<FolderTree>(res => res(tree))
    )
}

const createFile = (dir: string, name: string): File => {
    return {
        name,
        moduleName: name.replace(".stylex", ""),
        path: path.join(dir, name)
    }
}
