import { cwebp, grant_permission } from 'webp-converter';
import { NextRequest } from "next/server";
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdir, writeFile, stat, rm } from 'fs/promises';
import { ConvertedFileInterface } from "@/hooks/useConvertedFiles";
import {
    MAX_FILES,
    MAX_TOTAL_BYTES,
    TIME_FOR_FILE_TO_BE_DELETED,
    batchDir,
    imageExtension,
    removeExpiredBatches,
    safeBaseName,
} from "@/lib/storage";

// cwebp has to be executable; npm usually keeps the mode, this makes sure (ignored on read-only disks).
try { grant_permission(); } catch { /* read-only node_modules: the binary must already be executable */ }

// At most this many conversions run at the same time; the next ones get 503 and retry later.
const MAX_ACTIVE_CONVERSIONS = 2;
let activeConversions = 0;

const json = (body: object, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

export async function POST(request: NextRequest) {
    // Reject oversized uploads before reading them (form overhead allowed on top of the limit).
    const declaredSize = Number(request.headers.get("content-length") || 0);
    if (declaredSize > MAX_TOTAL_BYTES + 1_000_000) {
        return json({ error: "The files are bigger than 25MB in total." }, 413);
    }
    if (activeConversions >= MAX_ACTIVE_CONVERSIONS) {
        return json({ error: "The converter is busy. Please try again in a moment." }, 503);
    }

    activeConversions++;
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

        if (files.length === 0) return json({ error: "No file received." }, 400);
        if (files.length > MAX_FILES) return json({ error: `Send at most ${MAX_FILES} files at a time.` }, 400);
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > MAX_TOTAL_BYTES) return json({ error: "The files are bigger than 25MB in total." }, 413);

        await mkdir(dir, { recursive: true });

        const outputFilesData: ConvertedFileInterface[] = [];
        const failed: string[] = [];
        const usedNames = new Set<string>();

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const buffer = new Uint8Array(await file.arrayBuffer());
            const ext = imageExtension(buffer);
            if (!ext) {
                failed.push(file.name);
                continue;
            }

            // The original is stored under a neutral name, never the user's one.
            const input = join(dir, `input-${index}${ext}`);
            await writeFile(input, buffer);

            const base = safeBaseName(file.name);
            let outputFileName = `${base}.webp`;
            for (let n = 2; usedNames.has(outputFileName); n++) outputFileName = `${base}-${n}.webp`;
            usedNames.add(outputFileName);
            const output = join(dir, outputFileName);

            try {
                await cwebp(input, output, "-q 80");
            } catch {
                console.error("error while converting an image");
            }

            // The original never stays on the server after the conversion.
            await rm(input, { force: true });

            try {
                const { size } = await stat(output);
                outputFilesData.push({
                    name: outputFileName,
                    size,
                    downloadLink: `/api/download/${id}/${encodeURIComponent(outputFileName)}`,
                });
            } catch {
                usedNames.delete(outputFileName);
                failed.push(file.name);
            }
        }

        // The converted files are deleted after the download window.
        setTimeout(() => {
            rm(dir, { recursive: true, force: true });
        }, TIME_FOR_FILE_TO_BE_DELETED);

        if (outputFilesData.length === 0) {
            await rm(dir, { recursive: true, force: true });
            return json({ error: "None of the files could be converted. Use PNG, JPEG or TIFF images.", failed }, 422);
        }

        return json({
            message: "file(s) converted successfully",
            data: outputFilesData,
            failed,
        }, 200);

    } catch (error: any) {
        console.error(error);
        await rm(dir, { recursive: true, force: true });
        return json({ error: "Error trying to convert images." }, 500);
    } finally {
        activeConversions--;
    }
}
