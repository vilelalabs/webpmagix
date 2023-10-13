"use client";

import LoadedFile from "@/components/LoadedFile";
import Title from "@/components/Title";
import useLoadedFiles from "@/hooks/useLoadedFiles";


const Loaded = () => {

    const { loadedFiles } = useLoadedFiles();
    return (
        <div className="flex flex-col w-full items-center justify-center px-4 gap-24 md:px-52">
            <Title />
            <div className="flex flex-col bg-babypowder gap-[10px] p-8 w-full rounded-2xl">
                {loadedFiles.map((file, index) => (
                    <LoadedFile
                        key={index}
                        file={file}
                    />
                ))}


            </div>
            <button
                onClick={() => { }}
                className="bg-redviolet rounded-xl w-60 md:w-80 py-3 text-xl font-medium hover:bg-hoverredviolet m-4">Convert to WEBP</button>
        </div>
    );
}

export default Loaded;