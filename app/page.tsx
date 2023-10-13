"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import Title from "@/components/Title"
import useLoadedFiles, { FileInterface } from "@/hooks/useLoadedFiles";

const MAX_FILE_SIZE = 100000000 // 100MB

export default function Home() {

  const { loadedFiles, addLoadedFile } = useLoadedFiles()

  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleImageSelect = () => {
    setErrorMessage(null)
    inputFile.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const files = Array.from(e.target.files);

    // Check if files are valid
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        setErrorMessage("One or more files are too large")
        return
      }
      if (!files[i].type.includes("image")) {
        setErrorMessage("One or more files are not images");
        return
      }
    }


    for (let i = 0; i < files.length; i++) {
      const name = files[i].name
      const size = files[i].size
      const file = {
        name,
        size,
      } as FileInterface;
      addLoadedFile(file)
    }

    router.push("/loaded")

  }


  return (
    <main>
      <div className="flex flex-col w-full items-center justify-center p-20 gap-28">
        <Title />
        <div className="flex flex-col items-center gap-8 w-1/2">
          <p className="text-lg text-center font-light">Select any file with image format, eg. .png, .jpg, .jpeg, .gif, .svg, etc. Max file size is 100MB.</p>
          <button
            onClick={handleImageSelect}
            className="bg-redviolet rounded-xl w-80 py-3 text-xl font-medium hover:bg-hoverredviolet"
          >
            Select File(s) to Convert
            <input
              onChange={(e) => handleImageChange(e)}
              type='file'
              id='file'
              accept="image/*"
              multiple
              ref={inputFile}
              style={{ display: 'none' }}
            />
          </button>
          {errorMessage && <p className="text-xl font-medium text-red-600">{errorMessage}</p>}
        </div>
      </div>
    </main>
  )
}
