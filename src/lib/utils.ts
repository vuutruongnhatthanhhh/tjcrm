import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Guards a `?redirect=` query param against open-redirect: only an
// in-app absolute path ("/dashboard"), never a protocol-relative or
// external URL ("//evil.com", "https://evil.com").
export function isSafeRedirectPath(path: string | null | undefined): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}
