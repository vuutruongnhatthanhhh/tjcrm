import { getActiveCompany } from "@/lib/companies";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const STATUSES = ["active", "on_leave", "inactive"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getActiveCompany();
  if (!company) {
    return NextResponse.json({ error: "Chưa chọn công ty" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const fullName = String(body?.fullName ?? "").trim();

  if (!fullName) {
    return NextResponse.json({ error: "Vui lòng nhập họ và tên" }, { status: 400 });
  }

  const status = STATUSES.includes(body?.status) ? body.status : "active";

  const supabase = await createClient();

  // Scoped to company_id too (not just id) so a stale/foreign id can never
  // touch another company's row — defense in depth beyond RLS.
  const { error } = await supabase
    .from("employees")
    .update({
      full_name: fullName,
      email: String(body?.email ?? "").trim(),
      phone: String(body?.phone ?? "").trim(),
      department: String(body?.department ?? "").trim(),
      role: String(body?.role ?? "").trim(),
      status,
      join_date: body?.joinDate || null,
    })
    .eq("id", id)
    .eq("company_id", company.id);

  if (error) {
    return NextResponse.json({ error: "Không thể cập nhật nhân viên" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getActiveCompany();
  if (!company) {
    return NextResponse.json({ error: "Chưa chọn công ty" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id)
    .eq("company_id", company.id);

  if (error) {
    return NextResponse.json({ error: "Không thể xóa nhân viên" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
