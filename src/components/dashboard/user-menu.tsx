"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoutButton } from "./logout-button";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "??";
}

function Avatar({
  avatarUrl,
  name,
  className,
}: {
  avatarUrl?: string | null;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-primary-light to-primary font-semibold text-primary-foreground",
        className
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}

export function UserMenu({
  name = "Người dùng",
  email = "",
  avatarUrl,
}: {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}) {
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
        <Avatar avatarUrl={avatarUrl} name={name} className="h-8 w-8 text-sm" />
        <span className="hidden min-w-0 max-w-32 flex-col items-start leading-tight sm:flex">
          <span className="w-full truncate text-sm font-medium text-foreground">{name}</span>
          <span className="w-full truncate text-xs text-muted-foreground">{email}</span>
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
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <Avatar avatarUrl={avatarUrl} name={name} className="h-9 w-9 text-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/dashboard/ho-so"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          >
            <User className="h-4 w-4" />
            Hồ sơ của tôi
          </Link>
          <Link
            href="/dashboard/ho-so"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Cài đặt tài khoản
          </Link>
          <div className="my-1 h-px bg-border" />
          <LogoutButton
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-soft disabled:opacity-60"
            iconClassName="h-4 w-4"
          />
        </div>
      )}
    </div>
  );
}
