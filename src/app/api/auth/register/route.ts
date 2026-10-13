import { sendConfirmEmail } from "@/lib/mail/templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSafeRedirectPath } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const fullName = String(body?.fullName ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const redirect = isSafeRedirectPath(body?.redirect ?? null) ? (body.redirect as string) : null;

  if (!fullName || !email) {
    return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Mật khẩu phải có ít nhất 8 ký tự" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: fullName },
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/xac-nhan-email`,
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    return NextResponse.json(
      {
        error: message.includes("already")
          ? "Email này đã được đăng ký"
          : "Đăng ký thất bại, vui lòng thử lại",
      },
      { status: 400 }
    );
  }

  const hashedToken = data.properties?.hashed_token;
  if (hashedToken) {
    const confirmUrl = new URL(`${process.env.NEXT_PUBLIC_URL}/xac-nhan-email`);
    confirmUrl.searchParams.set("token_hash", hashedToken);
    if (redirect) confirmUrl.searchParams.set("redirect", redirect);

    try {
      await sendConfirmEmail(email, fullName, confirmUrl.toString());
    } catch (err) {
      console.error("Không gửi được email xác nhận:", err);
      return NextResponse.json(
        { error: "Không gửi được email xác nhận, vui lòng thử lại" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
