import { ACTIVE_COMPANY_COOKIE } from "@/lib/companies";
import { deleteCompanyAvatar, uploadCompanyAvatar } from "@/lib/company-avatar";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

async function requireOwner(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }) } as const;
  }

  const { data: membership } = await supabase
    .from("company_members")
    .select("role")
    .eq("company_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || membership.role !== "owner") {
    return {
      error: NextResponse.json(
        { error: "Chỉ chủ sở hữu mới được thực hiện thao tác này" },
        { status: 403 }
      ),
    } as const;
  }

  return { supabase, user } as const;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owner = await requireOwner(id);
  if ("error" in owner) return owner.error;
  const { supabase } = owner;

  const form = await req.formData().catch(() => null);
  const name = form?.get("name");
  const avatarFile = form?.get("avatar");

  const updates: Record<string, string> = {};

  if (typeof name === "string" && name.trim()) {
    updates.name = name.trim();
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

    try {
      updates.avatar_url = await uploadCompanyAvatar(avatarFile, id);
    } catch (err) {
      console.error("Không thể tải lên avatar công ty:", err);
      return NextResponse.json({ error: "Không thể tải lên ảnh đại diện" }, { status: 500 });
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Không có thay đổi nào" }, { status: 400 });
  }

  // RLS ("update_own_company") restricts this write to owners, which the
  // membership check above already confirmed — session client is enough.
  const { error } = await supabase.from("companies").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Không thể cập nhật công ty" }, { status: 500 });
  }

  return NextResponse.json({ success: true, avatarUrl: updates.avatar_url });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owner = await requireOwner(id);
  if ("error" in owner) return owner.error;

  // No DELETE policy exists on companies for the session client (same
  // reasoning as the missing INSERT policy — privileged writes go through
  // the service role, gated by the ownership check above instead of RLS).
  const admin = createAdminClient();
  const { error } = await admin.from("companies").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Không thể xóa công ty" }, { status: 500 });
  }

  await deleteCompanyAvatar(id).catch((err) => {
    console.error("Không thể xóa avatar công ty:", err);
  });

  const cookieStore = await cookies();
  if (cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value === id) {
    cookieStore.delete(ACTIVE_COMPANY_COOKIE);
  }

  return NextResponse.json({ success: true });
}
