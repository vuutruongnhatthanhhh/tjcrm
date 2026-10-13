import { uploadCompanyAvatar } from "@/lib/company-avatar";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024;
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
  const name = String(form?.get("name") ?? "").trim();
  const avatarFile = form?.get("avatar");

  if (!name) {
    return NextResponse.json({ error: "Vui lòng nhập tên công ty" }, { status: 400 });
  }

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!ALLOWED_TYPES.includes(avatarFile.type)) {
      return NextResponse.json(
        { error: "Chỉ hỗ trợ ảnh PNG, JPEG hoặc WebP" },
        { status: 400 }
      );
    }
    if (avatarFile.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ảnh tối đa 5MB" }, { status: 400 });
    }
  }

  // No insert policy exists on companies/company_members for the session
  // client (same reasoning as TJDiscipline's admin-only writes) — the
  // auth check above is what gates this route, not RLS.
  const admin = createAdminClient();
  const { data: company, error } = await admin
    .from("companies")
    .insert({ name, created_by: user.id })
    .select("id, name, avatar_url")
    .single();

  if (error || !company) {
    return NextResponse.json({ error: "Không thể tạo công ty" }, { status: 500 });
  }

  const { error: memberError } = await admin
    .from("company_members")
    .insert({ company_id: company.id, user_id: user.id, role: "owner" });

  if (memberError) {
    return NextResponse.json({ error: "Không thể tạo công ty" }, { status: 500 });
  }

  let avatarUrl: string | null = null;
  if (avatarFile instanceof File && avatarFile.size > 0) {
    try {
      avatarUrl = await uploadCompanyAvatar(avatarFile, company.id);
      await admin.from("companies").update({ avatar_url: avatarUrl }).eq("id", company.id);
    } catch (err) {
      console.error("Không thể tải lên avatar công ty:", err);
      // Company + membership were created successfully — avatar can be
      // added later from the edit dialog, so this isn't fatal.
    }
  }

  return NextResponse.json({
    company: { id: company.id, name: company.name, avatarUrl: avatarUrl ?? company.avatar_url },
  });
}
