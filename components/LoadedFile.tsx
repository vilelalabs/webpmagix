"use client";
import useLoadedFiles, {FileInterface} from "@/hooks/useLoadedFiles";
import { AiOutlineClose } from "react-icons/ai";

interface LoadedFileInterface {
    file: FileInterface;
}

const LoadedFile = ({file}: LoadedFileInterface) => {

    const {removeLoadedFile} = useLoadedFiles();

    return (
        <div className="flex flex-row items-center justify-between border rounded-xl shadow-redviolet shadow-md  border-redviolet p-3">
            <p className="text-richblack w-3/5">{file.name}</p>
            <p className="text-redviolet w-1/5">{file.size}</p>
            <AiOutlineClose
                onClick={() => removeLoadedFile(file)}
                size={25}
                className="text-titlered hover:scale-110 cursor-pointer"
            />
        </div>
    );
}

export default LoadedFile;