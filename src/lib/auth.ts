import { createClient } from "@/lib/supabase/server";

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
}

// Uses getUser() (not getSession()) because it revalidates the token against
// Supabase Auth instead of trusting the locally-decoded cookie. Profile
// fields (name/avatar) are read from the `profiles` table — the source of
// truth once a user has edited their profile — falling back to the signup
// metadata for a brand-new user whose row the trigger just created.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // Supabase isn't configured yet (.env.local still empty) — treat as
  // logged out instead of crashing every page that reads the current user.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name || (user.user_metadata?.full_name as string | undefined) || "";

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: fullName || user.email || "Người dùng",
    avatarUrl: profile?.avatar_url ?? null,
  };
}
