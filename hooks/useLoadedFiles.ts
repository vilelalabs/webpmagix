import { create } from 'zustand'


interface LoadedFilesInterface {
    loadedFiles: File[]
    addLoadedFile: (file: File) => void
    removeLoadedFile: (file: File) => void
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