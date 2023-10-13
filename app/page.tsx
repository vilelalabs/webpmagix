import Title from "@/components/Title"

export default function Home() {
  return (
    <main>
      <div className="flex flex-col w-full items-center justify-center p-20 gap-28">
        <Title />
        <div className="flex flex-col items-center gap-8 w-1/2">
          <p className="text-lg text-center font-light">Select any file with image format, eg. .png, .jpg, .jpeg, .gif, .svg, etc. Max file size is 100MB.</p>
          <button className="bg-redviolet rounded-xl w-80 py-3 text-xl font-medium hover:bg-hoverredviolet">Select File(s) to Convert</button>
        </div>
      </div>
    </main>
  )
}
