import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugifyUploadName } from "@/lib/utils";

export async function saveUploadedFile(file: File, folder: string) {
  const extension = path.extname(file.name) || ".bin";
  const baseName = slugifyUploadName(path.basename(file.name, extension)) || "file";
  const fileName = `${baseName}-${randomUUID()}${extension}`;
  const relativePath = `${folder}/${fileName}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (bucket) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(bucket).upload(relativePath, buffer, {
      contentType: file.type || undefined,
      upsert: false
    });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(relativePath);
    return data.publicUrl;
  }

  const targetDirectory = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(targetDirectory, { recursive: true });
  await writeFile(path.join(targetDirectory, fileName), buffer);
  return `/uploads/${folder}/${fileName}`;
}
