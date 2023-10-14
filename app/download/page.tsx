// TODO: Delete files if person leave page or after some time

"use client"

import Title from "@/components/Title";
import ConvertedFile from "@/components/ConvertedFile";
import useConvertedFiles, {ConvertedFileInterface} from "@/hooks/useConvertedFiles";
import { useRouter } from "next/navigation";
import useLoadedFiles from "@/hooks/useLoadedFiles";

const Download = () => {
    const router = useRouter();
    const { convertedFiles, clearConvertedFiles } = useConvertedFiles();
    const { clearLoadedFiles } = useLoadedFiles();

    const handleReturnToHome = () => {
        clearConvertedFiles();
        clearLoadedFiles();
        router.replace("/");
    }

    if(convertedFiles.length === 0) router.replace("/");

    return ( 
        <div className="flex flex-col w-full items-center justify-center px-4 gap-24 md:px-52">
            <Title />
            <div className="flex flex-col bg-babypowder gap-[10px] p-8 w-full rounded-2xl">
                {convertedFiles.map((file:ConvertedFileInterface, index:number) => (
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