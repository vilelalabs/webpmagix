"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Title from "@/components/Title"
import useLoadedFiles from "@/hooks/useLoadedFiles";

const MAX_TOTAL_SIZE = 25000000 // in bytes (25 MB), same limit as the server
const MAX_FILES = 20 // same limit as the server
// formats the converter (cwebp) really converts; BMP, GIF, ICO, SVG and WebP are not
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/tiff"];

export default function Home() {
  const { addLoadedFile, clearLoadedFiles } = useLoadedFiles()
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = () => {
    if (loading) return
    setErrorMessage(null)
    inputFile.current?.click();
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files);
    e.target.value = ""; // lets the same file be picked again after an error

    if (files.length === 0) return
    if (files.length > MAX_FILES) {
      setErrorMessage(`Select at most ${MAX_FILES} files at a time.`);
      return
    }
    const totalFilesSize = files.reduce((acc, file) => acc + file.size, 0)
    if (totalFilesSize > MAX_TOTAL_SIZE) {
      setErrorMessage("Sum of file(s) size is bigger than 25MB");
      return
    }
    if (files.some((file) => !ACCEPTED_TYPES.includes(file.type))) {
      setErrorMessage("One or more of the selected files are not supported. Use PNG, JPEG or TIFF images.");
      return
    }

    setLoading(true)
    clearLoadedFiles()
    files.forEach((file) => {
      addLoadedFile(file)
    });

    router.push("/loaded")
  }

  return (
    <main>
      <div className="flex flex-col w-full items-center justify-center px-6 py-20 gap-20 md:gap-28">
        <Title />
        <div className="flex flex-col items-center gap-8 md:w-1/2">
          <p className="text-lg text-center font-light text-babypowder">Select PNG, JPG/JPEG or TIFF images.
            <br /> Up to <span className="font-bold">{MAX_FILES} files</span> and <span className="font-bold">25MB</span> in total.
            <br /><span className="text-red-400">BMP, GIF, ICO, SVG and WebP itself are not supported as input.</span></p>

          <input
            onChange={handleImageChange}
            type='file'
            id='file'
            accept={ACCEPTED_TYPES.join(", ")}
            multiple
            ref={inputFile}
            className="hidden"
          />
          <button
            type="button"
            className={`${loading ? 'bg-hoverredviolet' : 'bg-redviolet hover:bg-hoverredviolet'} rounded-xl m-4 w-60 md:w-80 py-3 text-xl font-medium`}
            onClick={handleImageSelect}
            disabled={loading}
          >{loading ?
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing</span>
            </div>
            : <p>Select File(s) to Convert</p>
            }
          </button>

          {errorMessage && <p className="text-xl text-center font-medium text-red-500">{errorMessage}</p>}

          <p className="text-sm text-center font-light text-babypowder/80 max-w-md">
            🔒 Your images are only used for the conversion: the originals are deleted right after it
            and the WebP files within 5 minutes. No account, no cookies, no tracking.{" "}
            <Link href="/privacy" className="underline hover:text-turquoise">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
