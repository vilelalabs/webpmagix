"use client";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { ConvertedFileInterface } from "@/hooks/useConvertedFiles";

const ConvertedFiles = ({ name, size, downloadLink }: ConvertedFileInterface) => {
    const fileSize = size >= 1000000 ? `${(size / 1000000).toFixed(2)} MB` : `${(size / 1000).toFixed(2)} KB`

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between border rounded-xl shadow-turquoise shadow-md  border-turquoise p-3 gap-3 lg:gap-0">
            <p className="text-richblack lg:w-3/5 break-all">{name}</p>
            <p className="text-redviolet lg:w-1/5 text-right">{fileSize}</p>
            <a
                className="flex flex-row items-center justify-between gap-2 text-babypowder bg-redviolet rounded-2xl px-4 py-2 mr-[20px] ml-[30px] hover:bg-hoverredviolet"
                href={downloadLink}
                download={name}>
                <span className="text-xl uppercase">Download</span>
                <HiOutlineDocumentDownload className="text-babypowder" size={24} />
            </a>
        </div>
    );
}

export default ConvertedFiles;
