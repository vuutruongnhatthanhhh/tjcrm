import { uploadAvatar } from "@/lib/avatar";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB — generous input cap; sharp resizes/recompresses to webp afterwards.
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Vui lòng chọn một ảnh" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Chỉ hỗ trợ ảnh PNG, JPEG hoặc WebP" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ảnh tối đa 5MB" }, { status: 400 });
  }

  try {
    const avatarUrl = await uploadAvatar(file, user.id);

    // The storage write happens via the service-role client inside
    // uploadAvatar() (no storage.objects RLS policy exists, same as
    // TJDiscipline's species-images). The DB write below only touches the
    // caller's own row, which RLS ("update_own_profile") already allows
    // on the session-scoped client.
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (error) throw error;

    return NextResponse.json({ avatarUrl });
  } catch (err) {
    console.error("Không thể tải lên ảnh đại diện:", err);
    return NextResponse.json({ error: "Không thể tải lên ảnh đại diện" }, { status: 500 });
  }
}
