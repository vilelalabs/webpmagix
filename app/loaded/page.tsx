"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import useConvertedFiles, { ConvertedFileInterface } from "@/hooks/useConvertedFiles";
import useLoadedFiles from "@/hooks/useLoadedFiles";

import LoadedFile from "@/components/LoadedFile";

const Loaded = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { loadedFiles } = useLoadedFiles();
    const { addConvertedFile, clearConvertedFiles, setFailedFiles } = useConvertedFiles();
    const router = useRouter();

    useEffect(() => {
        if (loadedFiles.length === 0) router.replace('/');
    }, [loadedFiles, router]);

    const handleConversion = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const data = new FormData();
            loadedFiles.forEach((file, index) => {
                data.append(`file${index}`, file);
            });

            const res = await fetch("/api/convert", {
                method: "POST",
                body: data
            });
            const response = await res.json().catch(() => ({}));

            if (!res.ok) {
                setErrorMessage(response.error || "Error trying to convert images. Please try again.");
                return;
            }

            clearConvertedFiles();
            (response.data as ConvertedFileInterface[]).forEach((file) => addConvertedFile(file));
            setFailedFiles(response.failed ?? []);

            router.push("/download");

        } catch (error) {
            console.error(error);
            setErrorMessage("Could not reach the converter. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-full items-center justify-center px-4 py-10 gap-16 md:px-52">
            <Title />
            <div className="flex flex-col bg-babypowder gap-[10px] p-8 w-full rounded-2xl">
                {loadedFiles.map((file, index) => (
                    <LoadedFile
                        key={`${index}-${file.name}`}
                        file={file}
                        index={index}
                    />
                ))}
            </div>
            {errorMessage && <p className="text-xl text-center font-medium text-red-500">{errorMessage}</p>}
            <button
                className={`${loading ? 'bg-hoverredviolet' : 'bg-redviolet hover:bg-hoverredviolet'} rounded-xl m-4 w-60 md:w-80 py-3 text-xl font-medium`}
                onClick={handleConversion}
                disabled={loading || loadedFiles.length === 0}

            >{loading ?
                <div className="flex flex-row justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing</span>
                </div> : <>Convert to WEBP</>
                }

            </button>
        </div>
    );
}

export default Loaded;
