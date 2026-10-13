"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, MailCheck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DangKyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại, vui lòng thử lại.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <AuthShell
        title="Kiểm tra email của bạn"
        subtitle="Gần xong rồi! Hãy xác nhận email để kích hoạt tài khoản."
      >
        <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-surface px-6 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MailCheck className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm text-foreground">
              Liên kết xác nhận tài khoản đã được gửi tới
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">{email}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Không thấy email? Kiểm tra thư mục spam hoặc thử đăng ký lại sau vài phút.
          </p>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setSubmitted(false)}
          >
            Quay lại
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-medium text-primary hover:text-primary-hover">
            Đăng nhập
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Bắt đầu quản trị doanh nghiệp của bạn chỉ trong vài phút."
      footer={
        <span className="text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-medium text-primary hover:text-primary-hover">
            Đăng nhập
          </Link>
        </span>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormError message={error} />

        <Field label="Họ và tên" htmlFor="fullname">
          <Input
            id="fullname"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            icon={<User className="h-4 w-4" />}
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>

        <Field label="Email công việc" htmlFor="email">
          <Input
            id="email"
            type="email"
            placeholder="ten@congty.com"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="Mật khẩu" htmlFor="password" hint="Tối thiểu 8 ký tự, gồm chữ và số.">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="pointer-events-auto text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
        </Field>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong bg-surface text-primary accent-primary"
          />
          <span>
            Tôi đồng ý với{" "}
            <span className="font-medium text-foreground">Điều khoản dịch vụ</span>
            <br />
            và <span className="font-medium text-foreground">Chính sách bảo mật</span>.
          </span>
        </label>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
      </form>
    </AuthShell>
  );
}
