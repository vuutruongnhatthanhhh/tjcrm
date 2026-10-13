"use client";

import { Logo } from "@/components/logo";
import { X } from "lucide-react";
import { useEffect } from "react";
import { CompanySwitcher } from "./company-switcher";
import { SidebarNav } from "./sidebar";

export function MobileSidebar({
  open,
  onClose,
  companyName,
  companyAvatarUrl,
}: {
  open: boolean;
  onClose: () => void;
  companyName?: string;
  companyAvatarUrl?: string | null;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="animate-slide-in-left relative flex h-full w-72 max-w-[82vw] flex-col border-r border-border bg-surface">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Logo />
          <button
            onClick={onClose}
            aria-label="Đóng menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {companyName && (
          <div className="p-3">
            <CompanySwitcher name={companyName} avatarUrl={companyAvatarUrl} onNavigate={onClose} />
          </div>
        )}
        <SidebarNav onNavigate={onClose} />
      </aside>
    </div>
  );
}
