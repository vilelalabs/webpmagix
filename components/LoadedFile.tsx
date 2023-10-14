"use client";
import useLoadedFiles from "@/hooks/useLoadedFiles";
import { AiOutlineClose } from "react-icons/ai";

interface LoadedFileInterface {
    file: File;
}

const LoadedFile = ({file}: LoadedFileInterface) => {

    const {removeLoadedFile} = useLoadedFiles();
    const fileSize = file.size>=1000000 ? `${(file.size/1000000).toFixed(2)} MB` : `${(file.size/1000).toFixed(2)} KB`

    return (
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between border rounded-xl shadow-turquoise shadow-md  border-turquoise p-3 lg:gap-0 gap-2">
            <p className="text-richblack text-center lg:text-left lg:w-3/5">{file.name}</p>
            <p className="text-redviolet lg:w-1/5 text-right">{fileSize}</p>
            <AiOutlineClose
                onClick={() => removeLoadedFile(file)}
                size={25}
                className="text-titlered hover:scale-110 cursor-pointer"
            />
        </div>
    );
}

export default LoadedFile;