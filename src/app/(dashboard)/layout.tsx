import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { getActiveCompany } from "@/lib/companies";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const company = await getActiveCompany();

  // The proxy already redirects here when the active_company_id cookie is
  // missing; this covers the case where the cookie points at a company the
  // user is no longer a member of (RLS makes getActiveCompany() return
  // null for that too).
  if (user && !company) redirect("/chon-cong-ty");

  return (
    <DashboardShell
      userName={user?.fullName}
      userEmail={user?.email}
      userAvatarUrl={user?.avatarUrl}
      companyName={company?.name}
      companyAvatarUrl={company?.avatarUrl}
    >
      {children}
    </DashboardShell>
  );
}
