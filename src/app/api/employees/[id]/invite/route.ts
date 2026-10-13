import { getActiveCompany } from "@/lib/companies";
import { inviteEmployeeAccount } from "@/lib/employee-invite";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getActiveCompany();
  if (!company) {
    return NextResponse.json({ error: "Chưa chọn công ty" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: employee, error: fetchError } = await supabase
    .from("employees")
    .select("id, email, full_name, user_id")
    .eq("id", id)
    .eq("company_id", company.id)
    .maybeSingle();

  if (fetchError || !employee) {
    return NextResponse.json({ error: "Không tìm thấy nhân viên" }, { status: 404 });
  }
  if (employee.user_id) {
    return NextResponse.json({ error: "Nhân viên này đã có tài khoản" }, { status: 400 });
  }
  if (!employee.email) {
    return NextResponse.json({ error: "Nhân viên chưa có email" }, { status: 400 });
  }

  const invite = await inviteEmployeeAccount({
    email: employee.email,
    fullName: employee.full_name,
    companyId: company.id,
    companyName: company.name,
  });

  if ("error" in invite) {
    return NextResponse.json({ error: invite.error }, { status: 500 });
  }

  await supabase.from("employees").update({ user_id: invite.userId }).eq("id", id);

  return NextResponse.json({ success: true, warning: invite.warning });
}
