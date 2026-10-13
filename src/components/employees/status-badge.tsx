import { Badge } from "@/components/ui/badge";
import { type EmployeeStatus } from "@/lib/employees";

const config: Record<EmployeeStatus, { label: string; tone: "success" | "warning" | "default" }> = {
  active: { label: "Đang làm việc", tone: "success" },
  on_leave: { label: "Tạm nghỉ", tone: "warning" },
  inactive: { label: "Nghỉ việc", tone: "default" },
};

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  const { label, tone } = config[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
