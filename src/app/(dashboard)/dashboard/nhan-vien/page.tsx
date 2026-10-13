import { EmployeesManager } from "@/components/employees/employees-manager";
import { getActiveCompany } from "@/lib/companies";
import { getEmployees } from "@/lib/employees";
import { redirect } from "next/navigation";

export default async function NhanVienPage() {
  const company = await getActiveCompany();
  if (!company) redirect("/chon-cong-ty");

  const employees = await getEmployees(company.id);

  return <EmployeesManager employees={employees} />;
}
