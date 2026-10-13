import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const ACTIVE_COMPANY_COOKIE = "active_company_id";

export type CompanyRole = "owner" | "member";

export interface CompanySummary {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: CompanyRole;
}

type MembershipRow = {
  role: CompanyRole;
  companies: { id: string; name: string; avatar_url: string | null } | null;
};

// Lists every company the current user belongs to, newest membership last.
// RLS ("select_own_memberships" / "select_member_companies") already scopes
// this to the caller, so the session client is enough — no admin client.
export async function getUserCompanies(): Promise<CompanySummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_members")
    .select("role, companies(id, name, avatar_url)")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  // PostgREST embeds the many-to-one `companies` relation as a single
  // object at runtime, but without generated Database types TS can't prove
  // the cardinality and infers an array — hence the cast through `unknown`.
  return (data as unknown as MembershipRow[])
    .filter((row) => row.companies)
    .map((row) => ({
      id: row.companies!.id,
      name: row.companies!.name,
      avatarUrl: row.companies!.avatar_url,
      role: row.role,
    }));
}

// Reads the `active_company_id` cookie set by /api/companies/select and
// resolves it to a company the user is actually a member of. Returns null
// (instead of throwing) for a missing/stale/foreign cookie so callers can
// fall back to the company picker.
export async function getActiveCompany(): Promise<CompanySummary | null> {
  const cookieStore = await cookies();
  const companyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value;
  if (!companyId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_members")
    .select("role, companies(id, name, avatar_url)")
    .eq("company_id", companyId)
    .maybeSingle();

  const row = data as unknown as MembershipRow | null;
  if (error || !row?.companies) return null;

  return {
    id: row.companies.id,
    name: row.companies.name,
    avatarUrl: row.companies.avatar_url,
    role: row.role,
  };
}
