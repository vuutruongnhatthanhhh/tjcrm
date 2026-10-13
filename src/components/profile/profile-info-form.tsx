"use client";

import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { CheckCircle2, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProfileInfoForm({
  email,
  initialFullName,
}: {
  email: string;
  initialFullName: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Không thể cập nhật hồ sơ.");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormError message={error} />
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-3.5 py-2.5 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Đã lưu thông tin hồ sơ.
        </div>
      )}

      <Field label="Họ và tên" htmlFor="fullName">
        <Input
          id="fullName"
          icon={<User className="h-4 w-4" />}
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </Field>

      <Field label="Email" htmlFor="email" hint="Không thể thay đổi email tài khoản.">
        <Input id="email" icon={<Mail className="h-4 w-4" />} value={email} disabled />
      </Field>

      <Button type="submit" className="mt-1 self-start" disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
