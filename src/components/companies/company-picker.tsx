"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { type CompanySummary } from "@/lib/companies";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompanyCard } from "./company-card";
import { CompanyFormDialog, type CompanyDialogTarget } from "./company-form-dialog";

export function CompanyPicker({
  companies,
  userName,
}: {
  companies: CompanySummary[];
  userName: string;
}) {
  const router = useRouter();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [dialogTarget, setDialogTarget] = useState<CompanyDialogTarget | null>(null);
  const [selectError, setSelectError] = useState<string | null>(null);

  async function handleSelect(companyId: string) {
    setSelectError(null);
    setSelectingId(companyId);

    try {
      const res = await fetch("/api/companies/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSelectError(data.error || "Không thể vào công ty này.");
        setSelectingId(null);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setSelectError("Có lỗi xảy ra, vui lòng thử lại.");
      setSelectingId(null);
    }
  }

  function handleSaved() {
    setDialogTarget(null);
    router.refresh();
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div
        className="aurora-blob animate-aurora -left-32 -top-32 h-80 w-80 bg-primary/30 sm:h-104 sm:w-104"
        aria-hidden="true"
      />
      <div
        className="aurora-blob animate-aurora h-72 w-72 bg-primary/15 sm:h-96 sm:w-96"
        style={{ bottom: "-6rem", right: "-6rem", animationDelay: "-7s" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center justify-between">
          <Logo />
          <LogoutButton className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-60" />
        </div>

        <div className="animate-fade-in-up mt-12 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Chào {userName.split(" ").slice(-1)[0]}, chọn công ty để tiếp tục
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Bạn có thể thuộc nhiều công ty — chọn một công ty để vào trang tổng quan, hoặc
            tạo công ty mới.
          </p>

          {selectError && (
            <div className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
              {selectError}
            </div>
          )}

          {companies.length === 0 ? (
            <div className="glass-panel mt-8 flex flex-col items-center gap-4 rounded-2xl p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Bạn chưa thuộc công ty nào. Tạo công ty đầu tiên để bắt đầu quản trị.
              </p>
              <Button onClick={() => setDialogTarget({ mode: "create" })}>
                <Plus className="h-4 w-4" />
                Tạo công ty đầu tiên
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  name={company.name}
                  avatarUrl={company.avatarUrl}
                  role={company.role}
                  loading={selectingId === company.id}
                  onSelect={() => handleSelect(company.id)}
                  onEdit={
                    company.role === "owner"
                      ? () =>
                          setDialogTarget({
                            mode: "edit",
                            id: company.id,
                            name: company.name,
                            avatarUrl: company.avatarUrl,
                          })
                      : undefined
                  }
                />
              ))}

              <button
                type="button"
                onClick={() => setDialogTarget({ mode: "create" })}
                className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-strong p-5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2">
                  <Plus className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">Tạo công ty mới</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {dialogTarget && (
        <CompanyFormDialog
          target={dialogTarget}
          onClose={() => setDialogTarget(null)}
          onSaved={handleSaved}
          onDeleted={handleSaved}
        />
      )}
    </div>
  );
}
