"use client";

import { type ReactNode, useState } from "react";
import { MobileSidebar } from "./mobile-sidebar";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({
  children,
  userName,
  userEmail,
  userAvatarUrl,
  companyName,
  companyAvatarUrl,
}: {
  children: ReactNode;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string | null;
  companyName?: string;
  companyAvatarUrl?: string | null;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar companyName={companyName} companyAvatarUrl={companyAvatarUrl} />
      <MobileSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        companyName={companyName}
        companyAvatarUrl={companyAvatarUrl}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          onMenuClick={() => setMobileNavOpen(true)}
          userName={userName}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
        />
        <main className="flex-1 overflow-y-auto px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
