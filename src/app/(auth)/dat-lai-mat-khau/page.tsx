"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type Status = "verifying" | "ready" | "invalid" | "done";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifyStarted = useRef(false);

  useEffect(() => {
    // The recovery token is single-use. React Strict Mode runs effects
    // twice in dev, which would otherwise fire verifyOtp() twice: the first
    // call consumes the token, the second then fails — and whichever
    // response lands second overwrites the status shown.
    if (verifyStarted.current) return;
    verifyStarted.current = true;

    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    async function verify() {
      try {
        const supabase = createClient();

        if (tokenHash && type === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          setStatus(error ? "invalid" : "ready");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        setStatus(session ? "ready" : "invalid");
      } catch {
        setStatus("invalid");
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Không thể đặt lại mật khẩu, vui lòng thử lại.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setStatus("done");
    window.setTimeout(() => router.push("/dang-nhap"), 1800);
  }

  if (status === "verifying") {
    return (
      <AuthShell title="Đang xác thực" subtitle="Vui lòng chờ trong giây lát...">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang xác thực liên kết của bạn...</p>
        </div>
      </AuthShell>
    );
  }

  if (status === "invalid") {
    return (
      <AuthShell title="Liên kết không hợp lệ" subtitle="Liên kết đặt lại mật khẩu đã hết hạn hoặc không đúng.">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <p className="text-sm text-muted-foreground">
            Vui lòng yêu cầu một liên kết đặt lại mật khẩu mới.
          </p>
          <Link
            href="/quen-mat-khau"
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            Yêu cầu liên kết mới
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (status === "done") {
    return (
      <AuthShell title="Đặt lại mật khẩu thành công" subtitle="Bạn có thể đăng nhập bằng mật khẩu mới.">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="text-sm text-muted-foreground">Đang chuyển đến trang đăng nhập...</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Đặt mật khẩu mới"
      subtitle="Chọn một mật khẩu mới mạnh để bảo vệ tài khoản của bạn."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormError message={error} />

        <Field label="Mật khẩu mới" htmlFor="password" hint="Tối thiểu 8 ký tự, gồm chữ và số.">
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </Field>

        <Field label="Xác nhận mật khẩu" htmlFor="confirmPassword">
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function DatLaiMatKhauPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
