import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type Tone = "default" | "success" | "warning" | "danger" | "primary";

const toneClasses: Record<Tone, string> = {
  default: "bg-surface-2 text-muted-foreground border-border-strong",
  success: "bg-success-soft text-success border-success/30",
  warning: "bg-warning-soft text-warning border-warning/30",
  danger: "bg-danger-soft text-danger border-danger/30",
  primary: "bg-primary-soft text-primary border-primary/30",
};

export function Badge({
  tone = "default",
  children,
  className,
  dot = false,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
