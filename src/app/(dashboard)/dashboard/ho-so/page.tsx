import { AvatarUpload } from "@/components/profile/avatar-upload";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { ProfileInfoForm } from "@/components/profile/profile-info-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HoSoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/dang-nhap?redirect=/dashboard/ho-so");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Hồ sơ của tôi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">Thông tin cá nhân</h2>
        <div className="mt-5 flex flex-col gap-8 sm:flex-row sm:gap-10">
          <div className="sm:w-48 sm:shrink-0">
            <AvatarUpload initialUrl={user.avatarUrl} name={user.fullName} />
          </div>
          <div className="flex-1">
            <ProfileInfoForm email={user.email} initialFullName={user.fullName} />
          </div>
        </div>
      </div>

      <div className="glass-panel max-w-lg rounded-2xl p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">Đổi mật khẩu</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chọn một mật khẩu mới mạnh để bảo vệ tài khoản của bạn.
        </p>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
