"use client";

import { Input } from "@/components/ui/input";
import { type Employee, type EmployeeStatus } from "@/lib/employees";
import { KeyRound, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { RowActions } from "./row-actions";
import { StatusBadge } from "./status-badge";

const statusOptions: { value: EmployeeStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang làm việc" },
  { value: "on_leave", label: "Tạm nghỉ" },
  { value: "inactive", label: "Nghỉ việc" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 2]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function EmployeeTable({
  employees,
  departments,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  departments: string[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState<EmployeeStatus | "all">("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesQuery =
        query.trim() === "" ||
        e.fullName.toLowerCase().includes(query.toLowerCase()) ||
        e.email.toLowerCase().includes(query.toLowerCase());
      const matchesDept = department === "all" || e.department === department;
      const matchesStatus = status === "all" || e.status === status;
      return matchesQuery && matchesDept && matchesStatus;
    });
  }, [employees, query, department, status]);

  function toggleMenu(id: string) {
    setOpenMenuId((v) => (v === id ? null : id));
  }

  function handleEdit(e: Employee) {
    setOpenMenuId(null);
    onEdit(e);
  }

  function handleDelete(e: Employee) {
    setOpenMenuId(null);
    onDelete(e);
  }

  return (
    <div className="glass-panel rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        <div className="sm:w-72">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            icon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="h-11 flex-1 rounded-lg border border-border-strong bg-surface px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-44 sm:flex-none"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EmployeeStatus | "all")}
            className="h-11 flex-1 rounded-lg border border-border-strong bg-surface px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-44 sm:flex-none"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <span className="hidden text-sm text-muted-foreground sm:ml-auto sm:block">
          {filtered.length} / {employees.length} nhân viên
        </span>
      </div>

      {/* Mobile: card list */}
      <ul className="flex flex-col divide-y divide-border md:hidden">
        {filtered.map((e) => (
          <li key={e.id} className="p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-2 text-sm font-semibold text-foreground">
                {initials(e.fullName)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-medium text-foreground">
                      {e.fullName}
                      {e.userId && (
                        <KeyRound
                          className="h-3 w-3 shrink-0 text-primary"
                          aria-label="Đã có tài khoản đăng nhập"
                        />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.employeeCode} · {e.role || "—"}
                    </p>
                  </div>
                  <RowActions
                    open={openMenuId === e.id}
                    onToggle={() => toggleMenu(e.id)}
                    onEdit={() => handleEdit(e)}
                    onDelete={() => handleDelete(e)}
                  />
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={e.status} />
                  {e.department && (
                    <span className="rounded-full border border-border-strong px-2.5 py-1 text-xs text-muted-foreground">
                      {e.department}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 space-y-0.5 text-sm">
                  <p className="truncate text-foreground">{e.email || "—"}</p>
                  <p className="text-muted-foreground">{e.phone || "—"}</p>
                </div>
              </div>
            </div>
          </li>
        ))}

        {filtered.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted-foreground">
            {employees.length === 0
              ? "Chưa có nhân viên nào. Bấm “Thêm nhân viên” để bắt đầu."
              : "Không tìm thấy nhân viên phù hợp."}
          </li>
        )}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nhân viên</th>
              <th className="px-4 py-3 font-medium">Phòng ban</th>
              <th className="px-4 py-3 font-medium">Chức vụ</th>
              <th className="px-4 py-3 font-medium">Liên hệ</th>
              <th className="px-4 py-3 font-medium">Ngày vào làm</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                className="border-b border-border last:border-0 hover:bg-surface-2"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-2 text-xs font-semibold text-foreground">
                      {initials(e.fullName)}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-medium text-foreground">
                        {e.fullName}
                        {e.userId && (
                          <KeyRound
                            className="h-3 w-3 shrink-0 text-primary"
                            aria-label="Đã có tài khoản đăng nhập"
                          />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{e.employeeCode}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.department || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.role || "—"}</td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{e.email || "—"}</p>
                  <p className="text-xs text-muted-foreground">{e.phone || "—"}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(e.joinDate)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActions
                    open={openMenuId === e.id}
                    onToggle={() => toggleMenu(e.id)}
                    onEdit={() => handleEdit(e)}
                    onDelete={() => handleDelete(e)}
                  />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  {employees.length === 0
                    ? "Chưa có nhân viên nào. Bấm “Thêm nhân viên” để bắt đầu."
                    : "Không tìm thấy nhân viên phù hợp."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
