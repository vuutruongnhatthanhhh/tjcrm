import { cn } from "@/lib/utils";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="32,8 38.35,23.26 54.83,24.58 42.27,35.34 46.11,51.42 32,42.8 17.89,51.42 21.73,35.34 9.17,24.58 25.65,23.26"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
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
        <StarIcon className={cn("h-5 w-5", iconClassName)} />
      </span>
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          TJ<span className="text-gradient">CRM</span>
        </span>
      )}
    </div>
  );
}
