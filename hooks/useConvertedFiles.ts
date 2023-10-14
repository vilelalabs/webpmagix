import {create} from 'zustand';

export interface ConvertedFileInterface {
    name: string;
    size: number;
    downloadLink: string;
}

interface ConvertedFilesInterface {
    convertedFiles: ConvertedFileInterface[];
    addConvertedFile: (file: ConvertedFileInterface) => void;
    clearConvertedFiles: () => void;
}

const useConvertedFiles = create<ConvertedFilesInterface>((set) => ({
    convertedFiles: [],
    addConvertedFile: (file) => set((state) => ({
        convertedFiles: [...state.convertedFiles, file],
    })),
    clearConvertedFiles: () => set((state) => ({
        convertedFiles: [],
    })),
}));

export default useConvertedFiles;