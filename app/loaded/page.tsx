"use client";

import LoadedFile from "@/components/LoadedFile";
import Title from "@/components/Title";
import useLoadedFiles from "@/hooks/useLoadedFiles";


const Loaded = () => {

    const { loadedFiles } = useLoadedFiles();
    return (
        <div className="flex flex-col w-full items-center justify-center p-20 gap-28 px-52">
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
                className="bg-redviolet rounded-xl w-80 py-3 text-xl font-medium hover:bg-hoverredviolet">Convert to WEBP</button>
        </div>
    );
}

export default Loaded;