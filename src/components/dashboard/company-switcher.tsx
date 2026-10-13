import { CompanyAvatar } from "@/components/companies/company-avatar";
import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";

export function CompanySwitcher({
  name,
  avatarUrl,
  onNavigate,
}: {
  name: string;
  avatarUrl?: string | null;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/chon-cong-ty"
      onClick={onNavigate}
      className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2.5 transition-colors hover:bg-surface-hover"
    >
      <CompanyAvatar name={name} avatarUrl={avatarUrl} className="h-8 w-8 shrink-0 text-xs" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">Đổi công ty</p>
      </div>
      <ArrowLeftRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
