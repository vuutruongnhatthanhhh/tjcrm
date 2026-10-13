"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { createClient } from "@/lib/supabase/client";
import { isSafeRedirectPath } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type Status = "verifying" | "success" | "invalid";

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const verifyStarted = useRef(false);

  useEffect(() => {
    // The signup token is single-use. React Strict Mode runs effects twice
    // in dev, which would otherwise fire verifyOtp() twice: the first call
    // consumes the token, the second then fails with "invalid/expired" —
    // and whichever response lands second overwrites the status shown.
    if (verifyStarted.current) return;
    verifyStarted.current = true;

    const tokenHash = searchParams.get("token_hash");
    const redirectParam = searchParams.get("redirect");
    const redirectTo = isSafeRedirectPath(redirectParam) ? redirectParam : "/chon-cong-ty";

    async function verify() {
      if (!tokenHash) {
        setStatus("invalid");
        return;
      }

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "signup",
        });

        if (error) {
          setStatus("invalid");
          return;
        }

        setStatus("success");
        window.setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 1500);
      } catch {
        setStatus("invalid");
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "verifying") {
    return (
      <AuthShell title="Đang xác nhận email" subtitle="Vui lòng chờ trong giây lát...">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang xác thực liên kết của bạn...</p>
        </div>
      </AuthShell>
    );
  }

  if (status === "success") {
    return (
      <AuthShell title="Xác nhận thành công" subtitle="Tài khoản của bạn đã được kích hoạt.">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="text-sm text-muted-foreground">
            Đang chuyển đến bảng điều khiển...
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Liên kết không hợp lệ" subtitle="Liên kết xác nhận đã hết hạn hoặc không đúng.">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <p className="text-sm text-muted-foreground">
          Vui lòng thử đăng ký lại hoặc liên hệ hỗ trợ nếu sự cố tiếp diễn.
        </p>
        <Link
          href="/dang-ky"
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          Quay lại đăng ký
        </Link>
      </div>
    </AuthShell>
  );
}

export default function XacNhanEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
