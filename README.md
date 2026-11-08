# WEBP Magix

Web app that converts PNG, JPEG and TIFF images to WebP (quality 80) on its server: pick up to 20 files (25 MB in total), convert, download. The site was online at `webpmagix.hvilela.com` (AWS EC2 + NGINX) and is offline for now; see `IMPROVEMENTS.md` for the hosting decisions.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 3, Zustand
- [`webp-converter`](https://www.npmjs.com/package/webp-converter) 3, which runs the `cwebp` binary (libwebp 1.6) shipped in its package. `cwebp` converts PNG, JPEG and TIFF; BMP and GIF are refused.

## How it works

1. `app/page.tsx` checks the selection in the browser (types, 20 files, 25 MB) and keeps the files in memory (Zustand).
2. `/loaded` posts them to `POST /api/convert` (`app/api/convert/route.ts`), which checks the limits again, recognizes each image by its first bytes, writes it under a neutral name in a random folder `os.tmpdir()/webpmagix/<uuid>/`, runs `cwebp -q 80`, and deletes the original right away. At most 2 conversions run at a time; the next ones get 503.
3. `/download` lists the files, served by `GET /api/download/<uuid>/<name>` while the folder exists. The folder is deleted after 5 minutes (leftovers of a restart are swept on the next upload). No IP address, cookie or account is used: the random id in the link is the only key.

Privacy policy: `/privacy` (Portuguese and English, LGPD).

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type check included)
npm run start    # serve the build
npm run lint     # ESLint 9 flat config (eslint.config.mjs)
```

No environment variable is needed.

## Deploying

The app needs **one long-running Node.js server** (`npm run build && npm run start`) on Linux x64, with a writable temp folder: the conversion and the download must reach the same process. Behind a reverse proxy, allow request bodies of at least 26 MB (NGINX: `client_max_body_size 26m;`). Serverless platforms (e.g. Vercel) don't fit the current flow; see `IMPROVEMENTS.md`.
