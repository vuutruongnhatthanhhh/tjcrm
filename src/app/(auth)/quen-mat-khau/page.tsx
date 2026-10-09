"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function QuenMatKhauPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <AuthShell
        title="Kiểm tra email của bạn"
        subtitle="Chúng tôi vừa gửi hướng dẫn đặt lại mật khẩu."
      >
        <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-surface px-6 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MailCheck className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm text-foreground">
              Liên kết đặt lại mật khẩu đã được gửi tới
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">{email}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Không thấy email? Kiểm tra thư mục spam hoặc thử lại sau vài phút.
          </p>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setSent(false)}
          >
            Gửi lại email
          </Button>
        </div>

        <Link
          href="/dang-nhap"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Quên mật khẩu?"
      subtitle="Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu."
      footer={
        <Link
          href="/dang-nhap"
          className="flex items-center justify-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
        </Button>
      </form>
    </AuthShell>
  );
}
