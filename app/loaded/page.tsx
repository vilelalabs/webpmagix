"use client";
import LoadedFile from "@/components/LoadedFile";
import Title from "@/components/Title";
import useLoadedFiles from "@/hooks/useLoadedFiles";
import { useRouter } from "next/navigation";
import { blob } from "stream/consumers";


const Loaded = () => {
    const { loadedFiles } = useLoadedFiles();
    const router = useRouter();

    if (loadedFiles.length === 0) router.push("/");

    const handleConversion = async () => {
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

            if(!res.ok) throw new Error(await res.text());


        } catch (error) {
            console.error(error);
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
                onClick={handleConversion}
                className="bg-redviolet rounded-xl w-60 md:w-80 py-3 text-xl font-medium hover:bg-hoverredviolet m-4">Convert to WEBP</button>
        </div>
    );
}

export default Loaded;