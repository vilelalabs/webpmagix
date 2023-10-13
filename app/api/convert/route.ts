// @ts-ignore
import webp from 'webp-converter';
import { NextRequest } from "next/server";
import { join } from 'path';
import { writeFile,rm } from 'fs/promises';


export async function POST(request: NextRequest) {


    try {

        const data = await request.formData();
        const files: any = [];

        console.log("DATA: ", data);

        data.forEach((value, index) => {
            files.push(value as unknown as File);
        });

        console.log("FILES: ", files);

        files.forEach(async (file: any) => {

            //file: File | null = file.get("file") as unknown as File;

            if(!file) {
                return new Response(JSON.stringify({ error: "file not found" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const input = join('./', 'tmp', file.name);
            await writeFile(input, buffer);

            const filename = file.name.split('.')[0];
            const output = join('./', 'tmp', `${filename}.webp`);
            const res = await webp.cwebp(input, output, "-q 1");

            if(res){
                throw new Error(`error while converting the image ${file.name}`);
            }
            
        });

        // delete the file from the tmp folder
        files.forEach(async (file:any) => {            
            const input = join('./', 'tmp', file.name);
            await rm(input, { force: true });
        });



        return new Response(JSON.stringify({ message: "file uploaded successfully" }), {
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