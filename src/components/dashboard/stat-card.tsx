import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  icon: LucideIcon;
}) {
  return (
    <div className="glass-panel group rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl hover:shadow-black/20 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/25 to-primary/5 text-primary ring-1 ring-primary/20">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-[1.7rem]">
        {value}
      </p>
      <p
        className={cn(
          "mt-1.5 flex items-center gap-1 text-xs font-medium",
          trend === "up" ? "text-success" : "text-danger"
        )}
      >
        {trend === "up" ? "↑" : "↓"} {change}
        <span className="font-normal text-muted-foreground">
          so với tháng trước
        </span>
      </p>
    </div>
  );
}
