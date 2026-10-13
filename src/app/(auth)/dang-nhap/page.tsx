"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { isSafeRedirectPath } from "@/lib/utils";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectTo = isSafeRedirectPath(redirectParam) ? redirectParam : "/chon-cong-ty";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      const message = error.message.toLowerCase();
      setError(
        message.includes("confirm")
          ? "Vui lòng xác nhận email trước khi đăng nhập, kiểm tra hộp thư của bạn."
          : "Email hoặc mật khẩu không đúng."
      );
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
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
        <FormError message={error} />

        <Field label="Email" htmlFor="email">
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

        <Field label="Mật khẩu" htmlFor="password">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<Lock className="h-4 w-4" />}
            required
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

        <div className="flex justify-end">
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

export default function DangNhapPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
