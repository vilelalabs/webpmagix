import { create } from 'zustand'

interface LoadedFilesInterface {
    loadedFiles: File[]
    addLoadedFile: (file: File) => void
    removeLoadedFile: (index: number) => void
    clearLoadedFiles: () => void
}


const useLoadedFiles = create<LoadedFilesInterface>((set) => ({
    loadedFiles: [],
    addLoadedFile: (file) => set((state) => ({
        loadedFiles: [...state.loadedFiles, file],
    })),
    // by position: two files may have the same name
    removeLoadedFile: (index) => set((state) => ({
        loadedFiles: state.loadedFiles.filter((_, i) => i !== index),
    })),
    clearLoadedFiles: () => set(() => ({
        loadedFiles: [],
    })),
}));

export default useLoadedFiles;
