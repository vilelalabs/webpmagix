"use client";
import { AiOutlineClose } from "react-icons/ai";

interface LoadedFileProps {
    filename: string;
    filesize: string;
}


const LoadedFile = ({ filename, filesize }: LoadedFileProps) => {
    return (
        <div className="flex flex-row items-center justify-between border rounded-xl shadow-redviolet shadow-md  border-redviolet p-3">
            <p className="text-richblack w-3/5">{filename}</p>
            <p className="text-redviolet w-1/5">{filesize}</p>
            <AiOutlineClose
                onClick={() => console.log(`remove ${filename}`)}
                size={25}
                className="text-titlered hover:scale-110 cursor-pointer"
            />
        </div>
    );
}

export default LoadedFile;