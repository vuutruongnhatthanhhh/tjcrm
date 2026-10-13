import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const fullName = String(body?.fullName ?? "").trim();

  if (!fullName) {
    return NextResponse.json({ error: "Vui lòng nhập họ và tên" }, { status: 400 });
  }

  // RLS ("update_own_profile") already restricts this write to the
  // caller's own row, so the session-scoped client is enough here — no
  // need to reach for the service-role client.
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: "Không thể cập nhật hồ sơ" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
