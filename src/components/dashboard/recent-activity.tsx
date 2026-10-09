import { cn } from "@/lib/utils";
import { CheckCircle2, UserPlus, FileText, Clock } from "lucide-react";
import { type LucideIcon } from "lucide-react";

type Activity = {
  icon: LucideIcon;
  tone: "primary" | "success" | "warning";
  text: string;
  time: string;
};

const activities: Activity[] = [
  {
    icon: UserPlus,
    tone: "primary",
    text: "Nguyễn Thị Lan vừa được thêm vào phòng Kinh doanh",
    time: "5 phút trước",
  },
  {
    icon: CheckCircle2,
    tone: "success",
    text: "Hợp đồng #HD-2026-114 đã được phê duyệt",
    time: "42 phút trước",
  },
  {
    icon: FileText,
    tone: "primary",
    text: "Báo cáo doanh thu quý III đã được tạo",
    time: "2 giờ trước",
  },
  {
    icon: Clock,
    tone: "warning",
    text: "Hoàng Minh Đức xin nghỉ phép ngày 12/10",
    time: "4 giờ trước",
  },
];

const toneClasses: Record<Activity["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

export function RecentActivity() {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground">
        Hoạt động gần đây
      </h3>

      <ul className="mt-4 flex flex-col gap-4">
        {activities.map((a, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                toneClasses[a.tone]
              )}
            >
              <a.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-foreground">{a.text}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
