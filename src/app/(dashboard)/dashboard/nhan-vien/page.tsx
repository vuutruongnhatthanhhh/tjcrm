import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { EmployeeTable } from "@/components/employees/employee-table";

export default function NhanVienPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Quản lý nhân viên
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi hồ sơ, phòng ban và trạng thái làm việc của toàn bộ nhân
            viên.
          </p>
        </div>
        <AddEmployeeDialog className="w-full sm:w-auto" />
      </div>

      <EmployeeTable />
    </div>
  );
}
