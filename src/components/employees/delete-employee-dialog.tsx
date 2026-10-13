"use client";

import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { type Employee } from "@/lib/employees";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function DeleteEmployeeDialog({
  employee,
  onClose,
  onDeleted,
}: {
  employee: Employee;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/employees/${employee.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Không thể xóa nhân viên.");
        setLoading(false);
        return;
      }

      onDeleted();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="animate-fade-in absolute inset-0" onClick={onClose} />

      <div className="animate-fade-in-up relative w-full max-w-sm rounded-t-2xl border border-border bg-surface p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-border-strong sm:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Xóa nhân viên</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <FormError message={error} />

        <div className="mt-2 flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-danger-soft px-5 py-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <p className="text-sm text-foreground">
            Xóa <strong>{employee.fullName}</strong> khỏi danh sách nhân viên? Hành động này
            không thể hoàn tác.
          </p>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="danger"
            className="w-full sm:w-auto"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa nhân viên"}
          </Button>
        </div>
      </div>
    </div>
  );
}
