"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Building2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DangKyPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  }

  return (
    <AuthShell
      title="Tạo tài khoản doanh nghiệp"
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
        <Field label="Họ và tên" htmlFor="fullname">
          <Input
            id="fullname"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            icon={<User className="h-4 w-4" />}
            required
          />
        </Field>

        <Field label="Tên doanh nghiệp" htmlFor="company">
          <Input
            id="company"
            placeholder="Công ty TNHH ABC"
            icon={<Building2 className="h-4 w-4" />}
            required
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
            className="mt-0.5 h-4 w-4 rounded border-border-strong bg-surface text-primary accent-primary"
          />
          Tôi đồng ý với{" "}
          <span className="font-medium text-foreground">Điều khoản dịch vụ</span> và{" "}
          <span className="font-medium text-foreground">Chính sách bảo mật</span>.
        </label>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
      </form>
    </AuthShell>
  );
}
