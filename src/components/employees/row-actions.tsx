"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function RowActions({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        aria-label="Thao tác"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="animate-scale-in absolute right-0 top-full z-10 mt-1 w-40 origin-top-right rounded-lg border border-border bg-surface-2 p-1.5 shadow-xl">
          <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground hover:bg-surface-hover">
            <Pencil className="h-3.5 w-3.5" />
            Chỉnh sửa
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-danger hover:bg-danger-soft">
            <Trash2 className="h-3.5 w-3.5" />
            Xóa
          </button>
        </div>
      )}
    </div>
  );
}
