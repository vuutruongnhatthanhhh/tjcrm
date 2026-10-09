"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-surface-2"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary text-sm font-semibold text-primary-foreground">
          TA
        </span>
        <span className="hidden flex-col items-start leading-tight sm:flex">
          <span className="text-sm font-medium text-foreground">Trần An</span>
          <span className="text-xs text-muted-foreground">Quản trị viên</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="animate-scale-in absolute right-0 top-full z-20 mt-2 w-56 origin-top-right rounded-xl border border-border bg-surface-2 p-1.5 shadow-xl">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground">Trần An</p>
            <p className="text-xs text-muted-foreground">an.tran@tjcrm.com</p>
          </div>
          <div className="my-1 h-px bg-border" />
          <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground">
            <User className="h-4 w-4" />
            Hồ sơ của tôi
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground">
            <Settings className="h-4 w-4" />
            Cài đặt tài khoản
          </button>
          <div className="my-1 h-px bg-border" />
          <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-soft">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
