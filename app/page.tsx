//TODO: resolver questão do clique dulo durante o upload

"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import Title from "@/components/Title"
import useLoadedFiles from "@/hooks/useLoadedFiles";

const MAX_FILE_SIZE = 25000000 // in bytes (x1000000 for MB)

export default function Home() {
  const { addLoadedFile } = useLoadedFiles()
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = () => {
    setErrorMessage(null)
    inputFile.current?.click();
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files);

    // Check if files are valid
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        setErrorMessage("One or more files are too big");
        return
      }
      if (!files[i].type.includes("image")) {
        setErrorMessage("One or more of the selected files are not supported.");
        return
      }
      if (files[i].name.includes(".ico") || files[i].name.includes(".svg") || files[i].name.includes(".webp")) {
        setErrorMessage("One or more of the selected files are not supported");
        return
      }
    }

    files.forEach((file) => {
      addLoadedFile(file)
    });

    router.push("/loaded")

  }

  return (
    <main>
      <div className="flex flex-col w-full items-center justify-center p-20 gap-28 overflow-y-auto h-screen">
        <Title />
        <div className="flex flex-col items-center gap-8 md:w-1/2">
          <p className="text-lg text-center font-light">Select files with image format, eg. .png, .jpg, .jpeg, .gif, etc.
            <br /> Max file size is {MAX_FILE_SIZE/1000000}MB.
            <br /><span className="text-red-400">.ico and .svg and .webp itself are not supported as input.</span></p>
          <button
            onClick={handleImageSelect}
            className="bg-redviolet rounded-xl w-60 md:w-80 py-3 text-xl font-medium hover:bg-hoverredviolet m-4">
            Select File(s) to Convert
            <input
              onChange={(e) => handleImageChange(e)}

              type='file'
              id='file'
              accept="image/png, image/jpeg, image/tiff, image/bmp"
              multiple
              ref={inputFile}
              style={{ display: 'none' }}
            />
          </button>
          {errorMessage && <p className="text-xl text-center font-medium text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </main>
  )
}
