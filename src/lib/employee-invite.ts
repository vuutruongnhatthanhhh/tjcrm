import { sendEmployeeInviteEmail } from "@/lib/mail/templates";
import { createAdminClient } from "@/lib/supabase/admin";

type InviteResult = { userId: string; warning?: string } | { error: string };

// Admin invites an employee to log in: creates the auth user via
// generateLink({type:"invite"}) (no password — they set their own through
// the emailed link, same mechanic as the signup/recovery flows), adds them
// as a 'member' of the company, then sends the custom invite email.
// Mirrors the register route's pattern of bypassing Supabase's built-in
// auth email in favor of our own nodemailer/handlebars template.
export async function inviteEmployeeAccount({
  email,
  fullName,
  companyId,
  companyName,
}: {
  email: string;
  fullName: string;
  companyId: string;
  companyName: string;
}): Promise<InviteResult> {
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      data: { full_name: fullName },
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/thiet-lap-mat-khau?company_id=${companyId}`,
    },
  });

  if (error || !data.user) {
    const message = error?.message.toLowerCase() ?? "";
    return {
      error: message.includes("already")
        ? "Email này đã có tài khoản trên hệ thống."
        : "Không thể tạo lời mời đăng nhập.",
    };
  }

  const { error: memberError } = await admin
    .from("company_members")
    .insert({ company_id: companyId, user_id: data.user.id, role: "member" });

  if (memberError) {
    return { error: "Không thể thêm tài khoản vào công ty." };
  }

  const hashedToken = data.properties?.hashed_token;
  if (!hashedToken) {
    return { userId: data.user.id, warning: "Không thể tạo liên kết mời." };
  }

  const inviteUrl = new URL(`${process.env.NEXT_PUBLIC_URL}/thiet-lap-mat-khau`);
  inviteUrl.searchParams.set("token_hash", hashedToken);
  inviteUrl.searchParams.set("company_id", companyId);

  try {
    await sendEmployeeInviteEmail(email, fullName, companyName, inviteUrl.toString());
  } catch (err) {
    console.error("Không gửi được email mời nhân viên:", err);
    return { userId: data.user.id, warning: "Đã tạo tài khoản nhưng không gửi được email mời." };
  }

  return { userId: data.user.id };
}
