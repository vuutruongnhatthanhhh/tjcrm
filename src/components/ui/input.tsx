import { cn } from "@/lib/utils";
import { type ComponentProps, type ReactNode, useId } from "react";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label?: ReactNode;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  icon,
  endSlot,
  error,
  ...props
}: ComponentProps<"input"> & {
  icon?: ReactNode;
  endSlot?: ReactNode;
  error?: boolean;
}) {
  const id = useId();
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
          {icon}
        </span>
      )}
      <input
        id={props.id ?? id}
        className={cn(
          "h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors",
          "border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          icon && "pl-10",
          endSlot && "pr-10",
          className
        )}
        {...props}
      />
      {endSlot && (
        <span className="absolute right-3 flex items-center text-muted-foreground">
          {endSlot}
        </span>
      )}
    </div>
  );
}
