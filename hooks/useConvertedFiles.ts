import {create} from 'zustand';

export interface ConvertedFileInterface {
    name: string;
    size: number;
    downloadLink: string;
}

interface ConvertedFilesInterface {
    convertedFiles: ConvertedFileInterface[];
    failedFiles: string[];
    addConvertedFile: (file: ConvertedFileInterface) => void;
    setFailedFiles: (names: string[]) => void;
    clearConvertedFiles: () => void;
}

const useConvertedFiles = create<ConvertedFilesInterface>((set) => ({
    convertedFiles: [],
    failedFiles: [],
    addConvertedFile: (file) => set((state) => ({
        convertedFiles: [...state.convertedFiles, file],
    })),
    setFailedFiles: (names) => set(() => ({
        failedFiles: names,
    })),
    clearConvertedFiles: () => set(() => ({
        convertedFiles: [],
        failedFiles: [],
    })),
}));

export default useConvertedFiles;
