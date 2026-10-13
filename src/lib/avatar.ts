import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "avatars";

// Converts the uploaded image to a square 400x400 WebP (quality 85) and
// uploads it to the `avatars` bucket at a path keyed by the user's id, so
// each re-upload overwrites the previous avatar instead of accumulating.
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(buffer)
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 85 })
    .toBuffer();

  const path = `${userId}.webp`;
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(path, webp, {
    contentType: "image/webp",
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  // Cache-bust: the path is stable across re-uploads, so without a query
  // param the browser/CDN would keep serving the previous cached avatar.
  return `${data.publicUrl}?v=${Date.now()}`;
}
