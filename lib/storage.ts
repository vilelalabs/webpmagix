import { tmpdir } from "os";
import { basename, extname, join } from "path";
import { readdir, rm, stat } from "fs/promises";

// Where uploads and converted files live while a conversion is in progress.
//
// Each conversion gets its own folder in the OS temp dir, named by a random UUID:
// - never in public/: files added there after the build are not served in
//   production, and anyone could guess a name like "photo.webp";
// - never tied to the visitor (no IP address, cookie or account): the random id
//   in the download link is the only key (privacy by design, LGPD art. 46).
// Originals are deleted right after the conversion and the folder after
// TIME_FOR_FILE_TO_BE_DELETED, as the privacy policy says.

export const TIME_FOR_FILE_TO_BE_DELETED = 1000 * 60 * 5;

const ROOT = join(tmpdir(), "webpmagix");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const isBatchId = (id: string) => UUID.test(id);

export const batchDir = (id: string) => join(ROOT, id);

// "Minha Foto (1).png" -> "Minha_Foto_1": no path, no accents, only [A-Za-z0-9._-].
export function safeBaseName(fileName: string) {
    const base = basename(fileName, extname(fileName))
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^\w.-]+/g, "_")
        .replace(/^[._]+|_+$/g, "")
        .slice(0, 80);
    return base || "image";
}

export const isSafeOutputName = (name: string) =>
    /^[\w-][\w.-]{0,85}\.webp$/.test(name) && !name.includes("..");

// Leftovers of a server restart (the timers are gone): remove expired folders.
export async function removeExpiredBatches() {
    try {
        const now = Date.now();
        const ids = await readdir(ROOT);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (!isBatchId(id)) continue;
            const { mtimeMs } = await stat(batchDir(id));
            if (now - mtimeMs > TIME_FOR_FILE_TO_BE_DELETED) {
                await rm(batchDir(id), { recursive: true, force: true });
            }
        }
    } catch {
        // ROOT does not exist yet: nothing to clean.
    }
}
