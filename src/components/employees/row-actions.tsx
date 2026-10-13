"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_WIDTH = 160;
const MENU_HEIGHT_ESTIMATE = 92;

export function RowActions({
  open,
  onToggle,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // Rendered via portal (not absolutely positioned inside the row), since
  // the table wrapper's `overflow-x-auto` forces overflow-y to also clip
  // (CSS: setting one overflow axis to non-visible coerces the other away
  // from visible too), cutting the menu off whenever a row sits near the
  // table's bottom edge.
  useEffect(() => {
    if (!open || !buttonRef.current) {
      setPosition(null);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    // EmployeeTable renders both the mobile card list and the desktop
    // table at once (CSS hides whichever doesn't match the viewport), so
    // both instances for the same row share `open` via the parent's
    // openMenuId. The CSS-hidden one's button sits at a zero-size rect —
    // skip it so only the actually-visible instance's menu shows.
    if (rect.width === 0 && rect.height === 0) {
      setPosition(null);
      return;
    }

    let left = rect.right - MENU_WIDTH;
    left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8));

    const opensUpward = rect.bottom + MENU_HEIGHT_ESTIMATE > window.innerHeight;
    const top = opensUpward ? rect.top - MENU_HEIGHT_ESTIMATE - 4 : rect.bottom + 4;

    setPosition({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      onToggle();
    }
    function close() {
      onToggle();
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, onToggle]);

  return (
    <div className="inline-block">
      <button
        ref={buttonRef}
        onClick={onToggle}
        aria-label="Thao tác"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="animate-scale-in z-50 w-40 rounded-lg border border-border bg-surface-2 p-1.5 shadow-xl"
          >
            <button
              onClick={onEdit}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground hover:bg-surface-hover"
            >
              <Pencil className="h-3.5 w-3.5" />
              Chỉnh sửa
            </button>
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-danger hover:bg-danger-soft"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
