"use client";

import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

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
    setLoading(false);

    if (error) {
      setError("Không thể đổi mật khẩu, vui lòng thử lại.");
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormError message={error} />
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-3.5 py-2.5 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Đã đổi mật khẩu thành công.
        </div>
      )}

      <Field label="Mật khẩu mới" htmlFor="newPassword" hint="Tối thiểu 8 ký tự, gồm chữ và số.">
        <Input
          id="newPassword"
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

      <Field label="Xác nhận mật khẩu mới" htmlFor="confirmNewPassword">
        <Input
          id="confirmNewPassword"
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

      <Button type="submit" className="mt-1 self-start" disabled={loading}>
        {loading ? "Đang lưu..." : "Đổi mật khẩu"}
      </Button>
    </form>
  );
}
