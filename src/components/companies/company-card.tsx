"use client";

import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { CompanyAvatar } from "./company-avatar";

export function CompanyCard({
  name,
  avatarUrl,
  role,
  loading,
  onSelect,
  onEdit,
}: {
  name: string;
  avatarUrl: string | null;
  role: "owner" | "member";
  loading: boolean;
  onSelect: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="glass-panel group relative rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl hover:shadow-black/20">
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label="Chỉnh sửa công ty"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-surface-2 hover:text-foreground group-hover:opacity-100"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={onSelect}
        disabled={loading}
        className="flex w-full flex-col items-start gap-3 text-left disabled:opacity-60"
      >
        <CompanyAvatar name={name} avatarUrl={avatarUrl} className="h-14 w-14 text-lg" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{name}</p>
          <Badge tone={role === "owner" ? "primary" : "default"} className="mt-1.5">
            {role === "owner" ? "Chủ sở hữu" : "Thành viên"}
          </Badge>
        </div>
      </button>
    </div>
  );
}
