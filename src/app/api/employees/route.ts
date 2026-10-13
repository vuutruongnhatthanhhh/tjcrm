import { getActiveCompany } from "@/lib/companies";
import { inviteEmployeeAccount } from "@/lib/employee-invite";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const STATUSES = ["active", "on_leave", "inactive"];

export async function POST(req: NextRequest) {
  const company = await getActiveCompany();
  if (!company) {
    return NextResponse.json({ error: "Chưa chọn công ty" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const fullName = String(body?.fullName ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const department = String(body?.department ?? "").trim();
  const role = String(body?.role ?? "").trim();
  const status = STATUSES.includes(body?.status) ? body.status : "active";
  const joinDate = body?.joinDate || null;
  const createAccount = Boolean(body?.createAccount) && !!email;

  if (!fullName) {
    return NextResponse.json({ error: "Vui lòng nhập họ và tên" }, { status: 400 });
  }

  const supabase = await createClient();

  // Best-effort sequential display code (NV001, NV002, …) scoped to this
  // company. A race between two simultaneous creates could in theory
  // produce a duplicate — acceptable at this scale, and it's a display
  // label only, not a unique key.
  const { count } = await supabase
    .from("employees")
    .select("id", { count: "exact", head: true })
    .eq("company_id", company.id);

  const employeeCode = `NV${String((count ?? 0) + 1).padStart(3, "0")}`;

  // RLS ("members_insert_employees") restricts this to members of
  // company.id, which getActiveCompany() already confirmed — session
  // client is enough.
  const { data, error } = await supabase
    .from("employees")
    .insert({
      company_id: company.id,
      employee_code: employeeCode,
      full_name: fullName,
      email,
      phone,
      department,
      role,
      status,
      join_date: joinDate,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Không thể thêm nhân viên" }, { status: 500 });
  }

  if (!createAccount) {
    return NextResponse.json({ success: true, id: data.id });
  }

  // Account creation is a bonus on top of the employee record, not the
  // core artifact — a failure here shouldn't undo the employee row that
  // was just saved, so it's reported as a warning instead of an error.
  const invite = await inviteEmployeeAccount({
    email,
    fullName,
    companyId: company.id,
    companyName: company.name,
  });

  if ("error" in invite) {
    return NextResponse.json({ success: true, id: data.id, accountWarning: invite.error });
  }

  await supabase.from("employees").update({ user_id: invite.userId }).eq("id", data.id);

  return NextResponse.json({ success: true, id: data.id, accountWarning: invite.warning });
}
