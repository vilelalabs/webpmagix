// @ts-ignore
import webp from 'webp-converter';
import { NextRequest } from "next/server";
import { join } from 'path';
import { writeFile, readFile, rm } from 'fs/promises';
import { ConvertedFileInterface } from "@/hooks/useConvertedFiles";

const TIME_FOR_FILE_TO_BE_DELETED = 1000 * 60 * 5;

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const files: any = [];

        data.forEach((value, index) => {
            files.push(value as unknown as File);
        });

        let outputFilesData: ConvertedFileInterface[] = [];
        const promises: any = [];

        for (const file of files) {
            if (!file) {
                return new Response(JSON.stringify({ error: "file not found" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const input = join('./', "public", "tmp", file.name);
            await writeFile(input, buffer);

            const filename = file.name.split('.')[0];
            const outputFileName = `${filename}.webp`;
            const output = join('./', "public", "tmp", outputFileName);


            const res = await webp.cwebp(input, output, "-q 80");
            if (res) {
                console.error(`error while converting the image ${file.name}`);
            }

            // get the size of the converted file
            try {
                const outputFile = await readFile(output);
                const outputFileSize = outputFile.byteLength;
                outputFilesData.push({
                    name: outputFileName,
                    size: outputFileSize,
                    downloadLink: `./tmp/${outputFileName}`
                });
            } catch (error) { console.error(error); }


            files.forEach(async (file: any) => {
                const input = join('./', "public", "tmp", file.name);
                promises.push(rm(input, { force: true }));
            });

            outputFilesData.forEach(async (file: any) => {
                const output = join('./', "public", "tmp", file.name);
                setTimeout(() => {
                    rm(output, { force: true });
                }, TIME_FOR_FILE_TO_BE_DELETED);
            });

        }

        await Promise.all(promises);

        return new Response(JSON.stringify({
            message: "file(s) converted successfully",
            data: outputFilesData
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: "error trying to convert images." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}