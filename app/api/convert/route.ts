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
        const promises:any = [];
        
        for (const file of files) {
            if (!file) {
                return new Response(JSON.stringify({ error: "file not found" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const input = join('./', "tmp", file.name);
            await writeFile(input, buffer);

            const filename = file.name.split('.')[0];
            const outputFileName = `${filename}.webp`;
            const output = join('./', "tmp", outputFileName);
            const res = await webp.cwebp(input, output, "-q 80");
            if (res) {
                throw new Error(`error while converting the image ${file.name}`);
            }

            // get the size of the converted file
            const outputFile = await readFile(output);
            const outputFileSize = outputFile.byteLength;
            
            outputFilesData.push({
                name: outputFileName,
                size:outputFileSize,
                downloadLink: `./tmp/${outputFileName}`
            });

            files.forEach(async (file: any) => {
                const input = join('./', "tmp", file.name);
                promises.push(rm(input, { force: true }));
            });

            outputFilesData.forEach(async (file: any) => {
                const output = join('./', "tmp", file.name);
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
        return new Response(JSON.stringify({ error: "error while converting the image" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}