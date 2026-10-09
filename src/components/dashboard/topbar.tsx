"use client";

import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";
import { UserMenu } from "./user-menu";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname);

  return (
    <header className="glass-nav sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border px-3 sm:gap-4 sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Mở menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="lg:hidden">
        <Logo showWordmark={false} />
      </div>

      <h1 className="hidden truncate text-base font-semibold text-foreground md:block">
        {current?.label ?? "Tổng quan"}
      </h1>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        <div className="hidden w-56 lg:block xl:w-64">
          <Input
            placeholder="Tìm kiếm..."
            icon={<Search className="h-4 w-4" />}
            className="h-9 bg-surface-2"
          />
        </div>

        <button
          aria-label="Tìm kiếm"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          aria-label="Thông báo"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <UserMenu />
      </div>
    </header>
  );
}
