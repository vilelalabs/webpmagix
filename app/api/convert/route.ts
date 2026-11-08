// @ts-ignore
import webp from 'webp-converter';
import { NextRequest } from "next/server";
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { mkdir, writeFile, stat, rm } from 'fs/promises';
import { ConvertedFileInterface } from "@/hooks/useConvertedFiles";
import {
    TIME_FOR_FILE_TO_BE_DELETED,
    batchDir,
    removeExpiredBatches,
    safeBaseName,
} from "@/lib/storage";

const json = (body: object, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

export async function POST(request: NextRequest) {
    // One random folder per conversion: the download links only work with this id,
    // so no visitor data (IP, cookie, account) is needed to keep batches apart.
    const id = randomUUID();
    const dir = batchDir(id);

    try {
        await removeExpiredBatches();

        const data = await request.formData();
        const files: File[] = [];
        data.forEach((value) => {
            if (typeof value !== "string") files.push(value as File);
        });

        if (files.length === 0) return json({ error: "file not found" }, 400);

        await mkdir(dir, { recursive: true });

        const outputFilesData: ConvertedFileInterface[] = [];
        const usedNames = new Set<string>();

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            // The original is stored under a neutral name, never the user's one.
            const ext = extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 6);
            const input = join(dir, `input-${index}${ext}`);
            await writeFile(input, Buffer.from(await file.arrayBuffer()));

            const base = safeBaseName(file.name);
            let outputFileName = `${base}.webp`;
            for (let n = 2; usedNames.has(outputFileName); n++) outputFileName = `${base}-${n}.webp`;
            usedNames.add(outputFileName);
            const output = join(dir, outputFileName);

            const res = await webp.cwebp(input, output, "-q 80");
            if (res) {
                console.error("error while converting an image");
            }

            // The original never stays on the server after the conversion.
            await rm(input, { force: true });

            // get the size of the converted file
            try {
                const { size } = await stat(output);
                outputFilesData.push({
                    name: outputFileName,
                    size,
                    downloadLink: `/api/download/${id}/${encodeURIComponent(outputFileName)}`,
                });
            } catch (error) { console.error("converted file not found"); }
        }

        // The converted files are deleted after the download window.
        setTimeout(() => {
            rm(dir, { recursive: true, force: true });
        }, TIME_FOR_FILE_TO_BE_DELETED);

        return json({
            message: "file(s) converted successfully",
            data: outputFilesData,
        }, 200);

    } catch (error: any) {
        console.error(error);
        await rm(dir, { recursive: true, force: true });
        return json({ error: "error trying to convert images." }, 500);
    }
}
