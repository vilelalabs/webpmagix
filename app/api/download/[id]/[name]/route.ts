import { readFile } from "fs/promises";
import { join } from "path";
import { batchDir, isBatchId, isSafeOutputName } from "@/lib/storage";

// Serves a converted file while its folder exists (see lib/storage.ts). Replaces
// the old ./tmp/<name> links in public/, which are not served for files created
// after the build and could be guessed by anyone.
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string; name: string } }) {
    let name = params.name;
    try {
        name = decodeURIComponent(name);
    } catch {
        return new Response("Not found", { status: 404 });
    }
    if (!isBatchId(params.id) || !isSafeOutputName(name)) {
        return new Response("Not found", { status: 404 });
    }

    try {
        const file = await readFile(join(batchDir(params.id), name));
        return new Response(file, {
            headers: {
                "Content-Type": "image/webp",
                "Content-Disposition": `attachment; filename="${name}"`,
                "Cache-Control": "no-store",
                "X-Robots-Tag": "noindex",
            },
        });
    } catch {
        return new Response("This file has expired or does not exist.", { status: 404 });
    }
}
