# Improvement suggestions

Review of WEBP Magix (this repo), done on 2026-11-08, after the security and bug fixes of the same day. The site is offline (`webpmagix.hvilela.com` no longer exists; hvilela.com lists it as offline, without a link). Section 1 is the decision that is still open: where and how the conversion runs. Each item says where the problem is and what to do about it.

**Already done on 2026-11-08 (not items):**
- Next.js 13.5 → 16.4.5 and React 19, `webp-converter` 2 → 3 (no more `uuid`), postcss bump and a `minimatch` override in the lint tooling: `npm audit` reports 0 vulnerabilities.
- Uploads go to a random folder in the OS temp dir under neutral names, originals are deleted right after the conversion, files are served by `/api/download/<uuid>/<name>` and deleted after 5 minutes.
- The server checks the limits again (20 files, 25 MB), recognizes images by their first bytes (PNG, JPEG, TIFF) and runs at most 2 conversions at a time.
- Security headers (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), no `X-Powered-By`.
- `webp-converter` is a `serverExternalPackages` entry, so it finds its `cwebp` binary in `node_modules`: the old `script.sh` (copy of the binaries into `.next/server`) is gone.
- Fixed: BMP/GIF offered but never converted; conversion errors only in the console; a timer started on every render of `/download`; removing a file removed every file with the same name; a link inside a button; the footer was disabled and its links had no `https://`.
- LGPD privacy policy (`/privacy`), notices on the home and download pages, real README.

Verify changes with `npm run lint` (0 problems) and `npm run build` (type check included). To test a conversion: `npm run start`, then `curl -F f0=@image.png http://localhost:3000/api/convert`.

---

## 1. Hosting and processing (decision pending)

### 1.1 Where the conversion runs
Today a Node.js server receives the files, runs `cwebp` and keeps the results in its temp folder for 5 minutes, so the upload and the download must reach the **same process**. That works on one long-running server (as before on EC2 + NGINX), but not on serverless platforms: on Vercel, functions accept at most a 4.5 MB request body (the app allows 25 MB), and two requests can land on different instances that don't share `/tmp`.

Options, in order of preference:
- **A. Convert in the browser (recommended).** Decode and encode WebP on the visitor's device with libwebp compiled to WebAssembly (e.g. `@jsquash/webp`, quality settings like `cwebp`), or with `canvas.toBlob('image/webp', 0.8)` as a lighter fallback. No upload at all, so the files never leave the device (simplest privacy story), no server cost, no size limit from the host, and the site can be hosted as static files anywhere (Vercel included). The server routes, `lib/storage.ts` and `webp-converter` would go away.
- **B. Keep the server, one container.** A Docker image (`node:22-slim`, `npm ci && npm run build`, `npm run start`) on a small VM or container service (EC2/Lightsail, Fly.io, Render, Railway) behind a proxy with `client_max_body_size 26m`. Needs a health check, restart policy and log rotation, and keeps the current privacy text.
- **C. Serverless + object storage.** Upload straight from the browser to storage (Vercel Blob or S3 presigned URLs, there is an unused `BLOB_READ_WRITE_TOKEN` in the local `.env`), convert in a function that reads and writes the storage, and expire objects after 5 minutes. More moving parts than A or B.

### 1.2 Domain and status
Once one option is live: point `webpmagix.hvilela.com` to it, set the WebP Magix card in site3 (`src/data/projects.js`) back to `online` with the link, and update the privacy policy if the processing changes (option A: "your images never leave your device").

### 1.3 Abuse protection on a public server (options B and C)
The server caps concurrent conversions at 2 and answers 503 beyond that. On a public server, also add a per-IP rate limit at the proxy (NGINX `limit_req`), and mention it in the privacy policy (the IP is used only for that, in memory). A queue with a "your turn in…" message would be friendlier than a 503.

---

## 2. Converter

### 2.1 More input formats
`cwebp` refuses BMP and GIF. GIF (including animated) can use `gif2webp`, also shipped by `webp-converter` (`gwebp`). BMP needs another decoder (e.g. `sharp`, or a WASM decoder in option A).

### 2.2 Conversion options
Everything is converted with `-q 80`. Offer a quality slider, lossless mode, and an optional maximum width/height (resize before encoding), and show the size saved per file.

---

## 3. Product and quality

### 3.1 Usability
- Drag and drop on the home page.
- "Download all" as a ZIP.
- A preview of each image.
- Keep the selected files when the conversion fails, so the visitor can retry.

### 3.2 Language
The UI is in English only. Add PT-BR (the privacy policy already has both).

### 3.3 Tests and CI
There are no tests. Add unit tests for `lib/storage.ts` (`safeBaseName`, `isSafeOutputName`, `imageExtension`) and route tests for `/api/convert` (limits, rejected formats, cleanup) and `/api/download` (bad ids, traversal). Add a CI job running lint, build and the tests, plus `engines.node` (≥ 20.9, required by Next 16) in `package.json`.
