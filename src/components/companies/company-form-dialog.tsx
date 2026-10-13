"use client";

import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { AlertTriangle, Camera, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CompanyAvatar } from "./company-avatar";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export type CompanyDialogTarget =
  | { mode: "create" }
  | { mode: "edit"; id: string; name: string; avatarUrl: string | null };

export function CompanyFormDialog({
  target,
  onClose,
  onSaved,
  onDeleted,
}: {
  target: CompanyDialogTarget;
  onClose: () => void;
  onSaved: () => void;
  onDeleted?: () => void;
}) {
  const isEdit = target.mode === "edit";
  const [name, setName] = useState(isEdit ? target.name : "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(isEdit ? target.avatarUrl : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteWord, setDeleteWord] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const deleteConfirmed =
    deleteWord.trim().toLowerCase() === "delete" &&
    isEdit &&
    deleteName === target.name;
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Revoke the last-created preview blob URL on unmount (e.g. dialog closed
  // without saving).
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Chỉ hỗ trợ ảnh PNG, JPEG hoặc WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ảnh tối đa 5MB.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setAvatarFile(file);
    setPreviewUrl(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vui lòng nhập tên công ty.");
      return;
    }

    setError(null);
    setLoading(true);

    const form = new FormData();
    form.append("name", name.trim());
    if (avatarFile) form.append("avatar", avatarFile);

    try {
      const res = isEdit
        ? await fetch(`/api/companies/${target.id}`, { method: "PATCH", body: form })
        : await fetch("/api/companies", { method: "POST", body: form });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        setLoading(false);
        return;
      }

      onSaved();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || !deleteConfirmed) return;
    setError(null);
    setDeleting(true);

    try {
      const res = await fetch(`/api/companies/${target.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Không thể xóa công ty.");
        setDeleting(false);
        setConfirmingDelete(false);
        return;
      }

      onDeleted?.();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="animate-fade-in absolute inset-0" onClick={onClose} />

      <div className="animate-fade-in-up relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
        <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-border-strong sm:hidden" />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {confirmingDelete
              ? "Xóa công ty"
              : isEdit
                ? "Chỉnh sửa công ty"
                : "Tạo công ty mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {confirmingDelete && isEdit ? (
          <div className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-danger-soft px-5 py-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <p className="text-sm text-foreground">
                Xóa <strong>{target.name}</strong>? Toàn bộ thành viên và dữ liệu liên quan đến
                công ty này sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
              </p>
            </div>

            <Field label={<>Nhập <strong>delete</strong> để xác nhận</>} htmlFor="deleteWord">
              <Input
                id="deleteWord"
                placeholder="delete"
                autoComplete="off"
                value={deleteWord}
                onChange={(e) => setDeleteWord(e.target.value)}
              />
            </Field>

            <Field
              label={
                <>
                  Nhập tên công ty <strong>{target.name}</strong> để xác nhận
                </>
              }
              htmlFor="deleteName"
            >
              <Input
                id="deleteName"
                placeholder={target.name}
                autoComplete="off"
                value={deleteName}
                onChange={(e) => setDeleteName(e.target.value)}
              />
            </Field>

            <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setConfirmingDelete(false);
                  setDeleteWord("");
                  setDeleteName("");
                }}
                disabled={deleting}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="danger"
                className="w-full sm:w-auto"
                onClick={handleDelete}
                disabled={deleting || !deleteConfirmed}
              >
                {deleting ? "Đang xóa..." : "Xóa công ty"}
              </Button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormError message={error} />

            <div className="flex flex-col items-center gap-2 self-center">
              <div className="relative">
                <CompanyAvatar
                  name={name || "?"}
                  avatarUrl={previewUrl}
                  className="h-20 w-20 text-xl"
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  aria-label="Chọn ảnh đại diện công ty"
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Ảnh đại diện công ty (tùy chọn)
              </span>
            </div>

            <Field label="Tên công ty" htmlFor="companyFormName">
              <Input
                id="companyFormName"
                placeholder="Công ty TNHH ABC"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo công ty"}
              </Button>
            </div>

            {isEdit && (
              <div className="mt-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="flex items-center gap-2 text-sm font-medium text-danger hover:text-danger/80"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa công ty
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
