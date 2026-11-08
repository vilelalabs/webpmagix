"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useConvertedFiles, { ConvertedFileInterface } from "@/hooks/useConvertedFiles";
import useLoadedFiles from "@/hooks/useLoadedFiles";

import Title from "@/components/Title";
import ConvertedFile from "@/components/ConvertedFile";

const Download = () => {
    const router = useRouter();
    const { convertedFiles, failedFiles, clearConvertedFiles } = useConvertedFiles();
    const { clearLoadedFiles } = useLoadedFiles();

    // the originals are no longer needed in the page's memory once converted
    useEffect(() => {
        clearLoadedFiles();
    }, [clearLoadedFiles]);

    useEffect(() => {
        if (convertedFiles.length === 0) router.replace('/');
    }, [convertedFiles, router]);

    const handleReturnToHome = () => {
        clearConvertedFiles();
        router.replace('/');
    }

    return (
        <div className="flex flex-col w-full items-center justify-center px-4 py-10 gap-16 md:px-52">
            <Title />

            <div className="flex flex-col bg-babypowder gap-[10px] p-8 w-full rounded-2xl">
                <p className="text-redviolet text-center mb-4 text-lg font-medium">⚠️ You have up to 5 minutes to download the file(s) below:</p>
                {failedFiles.length > 0 && (
                    <p className="text-redviolet text-center break-all">
                        ℹ️ These files could not be converted (use PNG, JPEG or TIFF): {failedFiles.join(", ")}
                    </p>
                )}
                {convertedFiles.map((file: ConvertedFileInterface) => (
                    <ConvertedFile
                        key={file.downloadLink}
                        name={file.name}
                        size={file.size}
                        downloadLink={file.downloadLink}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={handleReturnToHome}
                    className="text-redviolet bg-turquoise rounded-xl w-60 md:w-80 py-3 text-xl font-medium hover:bg-hoverturquoise">Convert New Files</button>
                <p className="text-sm text-center font-light text-babypowder/80">
                    The files are deleted from the server after 5 minutes.{" "}
                    <Link href="/privacy" className="underline hover:text-turquoise">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}

export default Download;
