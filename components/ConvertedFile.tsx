"use client";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { ConvertedFileInterface } from "@/hooks/useConvertedFiles";

const ConvertedFiles = ({ name, size, downloadLink }: ConvertedFileInterface) => {
    const fileSize = size >= 1000000 ? `${(size / 1000000).toFixed(2)} MB` : `${(size / 1000).toFixed(2)} KB`

    return (
        <div className="flex flex-row items-center justify-between border rounded-xl shadow-turquoise shadow-md  border-turquoise p-3">
            <p className="text-richblack w-3/5">{name}</p>
            <p className="text-redviolet w-1/5 text-right">{fileSize}</p>
            <button className="text-babypowder bg-redviolet text-right rounded-2xl px-4 py-2 mr-[20px] ml-[30px] hover:bg-hoverredviolet">
                <a className="flex flex-row items-center justify-between gap-2" href={downloadLink} download>
                    <p className="text-xl uppercase">Download</p>
                    <HiOutlineDocumentDownload className="text-babypowder" size={24} />
                </a>
            </button>
        </div>
    );
}

export default ConvertedFiles;