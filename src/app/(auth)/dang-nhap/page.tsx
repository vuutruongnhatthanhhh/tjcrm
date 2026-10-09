"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DangNhapPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  }

  return (
    <AuthShell
      title="Đăng nhập"
      subtitle="Chào mừng trở lại! Vui lòng nhập thông tin để tiếp tục."
      footer={
        <span className="text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-medium text-primary hover:text-primary-hover">
            Đăng ký ngay
          </Link>
        </span>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            placeholder="ten@congty.com"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
            required
          />
        </Field>

        <Field label="Mật khẩu" htmlFor="password">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<Lock className="h-4 w-4" />}
            required
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border-strong bg-surface text-primary accent-primary"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link
            href="/quen-mat-khau"
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </AuthShell>
  );
}
