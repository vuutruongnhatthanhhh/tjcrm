import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "company-avatars";

// Same technique as lib/avatar.ts (user avatars): resize to a square WebP
// server-side with sharp, upload to a dedicated bucket keyed by id so
// re-uploads overwrite in place.
export async function uploadCompanyAvatar(file: File, companyId: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(buffer)
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 85 })
    .toBuffer();

  const path = `${companyId}.webp`;
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(path, webp, {
    contentType: "image/webp",
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

// Mirrors TJDiscipline's deleteSpeciesImage: best-effort storage cleanup
// when a company is deleted, parsing the storage path back out of the
// public URL.
export async function deleteCompanyAvatar(companyId: string): Promise<void> {
  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([`${companyId}.webp`]);
}
