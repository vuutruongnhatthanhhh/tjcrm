import { createClient } from "@/lib/supabase/server";

export type EmployeeStatus = "active" | "on_leave" | "inactive";

export interface Employee {
  id: string;
  companyId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  joinDate: string | null;
  userId: string | null;
}

type EmployeeRow = {
  id: string;
  company_id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  join_date: string | null;
  user_id: string | null;
};

function mapRow(row: EmployeeRow): Employee {
  return {
    id: row.id,
    companyId: row.company_id,
    employeeCode: row.employee_code,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    department: row.department,
    role: row.role,
    status: row.status,
    joinDate: row.join_date,
    userId: row.user_id,
  };
}

// RLS ("members_select_employees") already scopes this to companies the
// caller belongs to — the session client is enough, no admin client.
export async function getEmployees(companyId: string): Promise<Employee[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, company_id, employee_code, full_name, email, phone, department, role, status, join_date, user_id"
    )
    .eq("company_id", companyId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return (data as EmployeeRow[]).map(mapRow);
}
