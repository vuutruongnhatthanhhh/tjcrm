"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await Promise.all([
      supabase.auth.signOut(),
      // Clear the active-company cookie so the next login (possibly by a
      // different person on a shared browser) always starts at the picker.
      fetch("/api/companies/select", { method: "DELETE" }),
    ]);
    router.push("/dang-nhap");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} disabled={loading} className={className}>
      <LogOut className={cn("h-4.5 w-4.5", iconClassName)} />
      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
