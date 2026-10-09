import { cn } from "@/lib/utils";

function FistIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="16" y="20" width="7" height="12" rx="3.5" fill="currentColor" />
      <rect x="25" y="16" width="7" height="16" rx="3.5" fill="currentColor" />
      <rect x="34" y="18" width="7" height="14" rx="3.5" fill="currentColor" />
      <rect x="43" y="22" width="7" height="10" rx="3.5" fill="currentColor" />
      <rect x="16" y="28" width="34" height="20" rx="9" fill="currentColor" />
      <circle cx="13" cy="34" r="8" fill="currentColor" />
      <rect x="24" y="47" width="24" height="13" rx="4" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  iconClassName,
  showWordmark = true,
}: {
  className?: string;
  iconClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-light to-primary text-primary-foreground shadow-[0_4px_16px_-2px_var(--primary-glow)]">
        <FistIcon className={cn("h-5 w-5", iconClassName)} />
      </span>
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          TJ<span className="text-gradient">CRM</span>
        </span>
      )}
    </div>
  );
}
