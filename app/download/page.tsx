"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useConvertedFiles, { ConvertedFileInterface } from "@/hooks/useConvertedFiles";
import useLoadedFiles from "@/hooks/useLoadedFiles";

import Title from "@/components/Title";
import ConvertedFile from "@/components/ConvertedFile";

const Download = () => {
    const router = useRouter();
    const { convertedFiles, clearConvertedFiles } = useConvertedFiles();
    const { clearLoadedFiles } = useLoadedFiles();

    setTimeout(() => {
        clearLoadedFiles();
    }, 2000);

    const handleReturnToHome = () => {
        clearConvertedFiles();
        if (typeof window !== "undefined") {
            router.replace('/');
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (convertedFiles.length === 0) router.replace('/');
        }
    }, [convertedFiles,router]);

    return (
        <div className="flex flex-col w-full items-center justify-center px-4 gap-24 md:px-52">
            <Title />

            <div className="flex flex-col bg-babypowder gap-[10px] p-8 w-full rounded-2xl">
                <p className="text-redviolet text-center mb-4 text-lg font-medium">⚠️ You have up to 5 minutes to download the file(s) below:</p>
                <p className="text-redviolet text-center ">ℹ️ If some of the files don't appear on list below,<br/> try to convert this file individually.</p>
                {convertedFiles.map((file: ConvertedFileInterface, index: number) => (
                    <ConvertedFile
                        key={index}
                        name={file.name}
                        size={file.size}
                        downloadLink={file.downloadLink}
                    />
                ))}
            </div>
            <button
                onClick={handleReturnToHome}
                className="text-redviolet bg-turquoise rounded-xl w-60 md:w-80 py-3 text-xl font-medium hover:bg-hoverturquoise m-4">Convert New Files</button>
        </div>
    );
}

export default Download;