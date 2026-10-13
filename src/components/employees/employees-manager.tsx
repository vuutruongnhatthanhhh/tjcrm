"use client";

import { Button } from "@/components/ui/button";
import { type Employee } from "@/lib/employees";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import { EmployeeFormDialog, type EmployeeDialogTarget } from "./employee-form-dialog";
import { EmployeeTable } from "./employee-table";

export function EmployeesManager({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [dialogTarget, setDialogTarget] = useState<EmployeeDialogTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))),
    [employees]
  );

  function handleSaved() {
    setDialogTarget(null);
    router.refresh();
  }

  function handleDeleted() {
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Quản lý nhân viên
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi hồ sơ, phòng ban và trạng thái làm việc của toàn bộ nhân viên.
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setDialogTarget({ mode: "create" })}>
          <Plus className="h-4 w-4" />
          Thêm nhân viên
        </Button>
      </div>

      <EmployeeTable
        employees={employees}
        departments={departments}
        onEdit={(employee) => setDialogTarget({ mode: "edit", employee })}
        onDelete={(employee) => setDeleteTarget(employee)}
      />

      {dialogTarget && (
        <EmployeeFormDialog
          target={dialogTarget}
          departments={departments}
          onClose={() => setDialogTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteEmployeeDialog
          employee={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
