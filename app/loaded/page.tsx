"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import useConvertedFiles, { ConvertedFileInterface } from "@/hooks/useConvertedFiles";
import useLoadedFiles from "@/hooks/useLoadedFiles";

import LoadedFile from "@/components/LoadedFile";

const Loaded = () => {
    const [loading, setLoading] = useState(false);

    const { loadedFiles } = useLoadedFiles();
    const { addConvertedFile } = useConvertedFiles();
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (loadedFiles.length === 0) router.replace('/');
        }
    }, [loadedFiles, router]);

    const handleConversion = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            loadedFiles.forEach((file, index) => {
                data.append(`file${index}`, file);
            });


            const res = await fetch("/api/convert",
                {
                    method: "POST",
                    body: data
                }
            );

            if (!res.ok) throw new Error(await res.text());

            const response = await res.json();
            const files = response.data;
            files.forEach((file: ConvertedFileInterface) => {
                addConvertedFile(file);
            });


            router.push("/download");

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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
                className={`${loading ? 'bg-hoverredviolet' : 'bg-redviolet hover:bg-hoverredviolet'} rounded-xl m-4 w-60 md:w-80 py-3 text-xl font-medium`}
                onClick={handleConversion}
                disabled={loading}

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