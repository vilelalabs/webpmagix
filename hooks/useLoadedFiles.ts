import { create } from 'zustand'

export interface FileInterface{
    name: string
    size: string
}

interface LoadedFilesInterface {
    loadedFiles: FileInterface[]
    addLoadedFile: (file: FileInterface) => void
    removeLoadedFile: (file: FileInterface) => void
}


const useLoadedFiles = create<LoadedFilesInterface>((set) => ({
    loadedFiles: [],
    addLoadedFile: (file) => set((state) => ({
        loadedFiles: [...state.loadedFiles, file],
    })),
    removeLoadedFile: (file) => set((state) => ({
        loadedFiles: state.loadedFiles.filter((f) => f.name !== file.name),
    })),
}));

export default useLoadedFiles;