"use client";

import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Field, Input } from "@/components/ui/input";
import { type Employee, type EmployeeStatus } from "@/lib/employees";
import { CheckCircle2, KeyRound, X } from "lucide-react";
import { useEffect, useState } from "react";

export type EmployeeDialogTarget = { mode: "create" } | { mode: "edit"; employee: Employee };

const statusOptions: { value: EmployeeStatus; label: string }[] = [
  { value: "active", label: "Đang làm việc" },
  { value: "on_leave", label: "Tạm nghỉ" },
  { value: "inactive", label: "Nghỉ việc" },
];

export function EmployeeFormDialog({
  target,
  departments,
  onClose,
  onSaved,
}: {
  target: EmployeeDialogTarget;
  departments: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = target.mode === "edit";
  const initial = isEdit ? target.employee : null;

  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [status, setStatus] = useState<EmployeeStatus>(initial?.status ?? "active");
  const [joinDate, setJoinDate] = useState(initial?.joinDate ?? "");
  const [createAccount, setCreateAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountWarning, setAccountWarning] = useState<string | null>(null);

  const [invited, setInvited] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    setError(null);
    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      role: role.trim(),
      status,
      joinDate: joinDate || null,
      createAccount: !isEdit && createAccount,
    };

    try {
      const res = isEdit
        ? await fetch(`/api/employees/${target.employee.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/employees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        setLoading(false);
        return;
      }

      if (data.accountWarning) {
        setAccountWarning(data.accountWarning);
        setLoading(false);
        return;
      }

      onSaved();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setLoading(false);
    }
  }

  async function handleInvite() {
    if (!isEdit) return;
    setInviteError(null);
    setInviting(true);

    try {
      const res = await fetch(`/api/employees/${target.employee.id}/invite`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setInviteError(data.error || "Không thể gửi lời mời.");
        setInviting(false);
        return;
      }

      setInvited(true);
      setInviting(false);
    } catch {
      setInviteError("Có lỗi xảy ra, vui lòng thử lại.");
      setInviting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="animate-fade-in absolute inset-0" onClick={onClose} />

      <div className="animate-fade-in-up relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6">
        <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-border-strong sm:hidden" />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {accountWarning ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-3.5 py-2.5 text-sm text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Đã thêm nhân viên.
            </div>
            <FormError message={accountWarning} />
            <Button type="button" className="self-end" onClick={onSaved}>
              Đóng
            </Button>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormError message={error} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Họ và tên" htmlFor="employeeFullName">
                <Input
                  id="employeeFullName"
                  placeholder="Nguyễn Văn A"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Field>
              <Field label="Chức vụ" htmlFor="employeeRole">
                <Input
                  id="employeeRole"
                  placeholder="Chuyên viên"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email" htmlFor="employeeEmail">
                <Input
                  id="employeeEmail"
                  type="email"
                  placeholder="ten@congty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Số điện thoại" htmlFor="employeePhone">
                <Input
                  id="employeePhone"
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phòng ban" htmlFor="employeeDepartment">
                <Input
                  id="employeeDepartment"
                  list="employee-departments"
                  placeholder="Kinh doanh"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <datalist id="employee-departments">
                  {departments.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </Field>
              <Field label="Ngày vào làm" htmlFor="employeeJoinDate">
                <DateInput
                  id="employeeJoinDate"
                  value={joinDate ?? ""}
                  onChange={setJoinDate}
                />
              </Field>
            </div>

            <Field label="Trạng thái" htmlFor="employeeStatus">
              <select
                id="employeeStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                className="h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            {!isEdit && (
              <label
                className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm transition-colors ${
                  email ? "border-border-strong bg-surface-2" : "border-border bg-surface-2/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={createAccount && !!email}
                  disabled={!email}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong bg-surface text-primary accent-primary disabled:opacity-50"
                />
                <span className={email ? "text-foreground" : "text-muted-foreground"}>
                  Tạo tài khoản đăng nhập cho nhân viên này và gửi email mời thiết lập mật khẩu.
                  {!email && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Cần nhập email để bật tùy chọn này.
                    </span>
                  )}
                </span>
              </label>
            )}

            {isEdit && target.employee.email && (
              <div className="rounded-lg border border-border-strong bg-surface-2 px-3.5 py-3">
                {target.employee.userId ? (
                  <p className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Nhân viên đã có tài khoản đăng nhập.
                  </p>
                ) : invited ? (
                  <p className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Đã gửi lời mời đăng nhập tới {target.employee.email}.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Nhân viên này chưa có tài khoản đăng nhập.
                    </p>
                    {inviteError && <FormError message={inviteError} />}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="self-start"
                      onClick={handleInvite}
                      disabled={inviting}
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      {inviting ? "Đang gửi..." : "Gửi lời mời đăng nhập"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm nhân viên"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
