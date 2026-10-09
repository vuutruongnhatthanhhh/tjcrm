"use client";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { departments } from "@/lib/mock-employees";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export function AddEmployeeDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className}>
        <Plus className="h-4 w-4" />
        Thêm nhân viên
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="animate-fade-in absolute inset-0" onClick={() => setOpen(false)} />

          <div className="animate-fade-in-up relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6">

            <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-border-strong sm:hidden" />

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Thêm nhân viên mới
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Đóng"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Họ và tên">
                  <Input placeholder="Nguyễn Văn A" required />
                </Field>
                <Field label="Chức vụ">
                  <Input placeholder="Chuyên viên" required />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Email">
                  <Input type="email" placeholder="ten@tjcrm.com" required />
                </Field>
                <Field label="Số điện thoại">
                  <Input placeholder="09xx xxx xxx" required />
                </Field>
              </div>

              <Field label="Phòng ban">
                <select
                  required
                  defaultValue=""
                  className="h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled>
                    Chọn phòng ban
                  </option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => setOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Lưu nhân viên
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
