import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, useId } from "react";

// Native <input type="date"> renders its text in whatever format the
// browser/OS locale dictates (often mm/dd/yyyy) — the `lang` attribute does
// NOT override this in Chromium. To force dd/mm/yyyy regardless of the
// visitor's locale, the native text is hidden (text-transparent) and a
// formatted, non-interactive overlay is drawn on top; the real input stays
// fully functional underneath (native calendar popup, keyboard entry, the
// picker icon) since only its text color changed.
export function DateInput({
  value,
  onChange,
  id,
  className,
  placeholder = "dd/mm/yyyy",
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  placeholder?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "id">) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const [year, month, day] = value ? value.split("-") : [];
  const display = year && month && day ? `${day}/${month}/${year}` : "";

  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        id={inputId}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-transparent caret-transparent outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        {...props}
      />
      <span
        className={cn(
          "pointer-events-none absolute left-3.5 text-sm",
          display ? "text-foreground" : "text-muted-foreground/70"
        )}
      >
        {display || placeholder}
      </span>
    </div>
  );
}
