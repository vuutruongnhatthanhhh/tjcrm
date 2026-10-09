import { Logo } from "@/components/logo";
import { ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { type ReactNode } from "react";

const highlights = [
  {
    icon: Users,
    title: "Quản lý nhân sự tập trung",
    desc: "Theo dõi hồ sơ, phòng ban và hiệu suất của toàn bộ nhân viên.",
  },
  {
    icon: TrendingUp,
    title: "Báo cáo trực quan",
    desc: "Số liệu kinh doanh và vận hành cập nhật theo thời gian thực.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật theo phân quyền",
    desc: "Kiểm soát truy cập chặt chẽ theo vai trò trong tổ chức.",
  },
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background">
      {/* ambient glow, visible on every breakpoint */}
      <div
        className="aurora-blob animate-aurora -left-32 -top-32 h-80 w-80 bg-primary/30 sm:h-104 sm:w-104"
        aria-hidden="true"
      />
      <div
        className="aurora-blob animate-aurora h-72 w-72 bg-primary/15 sm:h-96 sm:w-96 lg:left-[40%]"
        style={{ bottom: "-6rem", right: "-6rem", animationDelay: "-7s" }}
        aria-hidden="true"
      />

      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden border-r border-border px-12 py-10 lg:flex">
        <div className="bg-grid-glow pointer-events-none absolute inset-0" />
        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 flex flex-col gap-9">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Nền tảng CRM thế hệ mới
          </span>

          <div>
            <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-foreground xl:text-4xl">
              Vận hành doanh nghiệp{" "}
              <span className="text-gradient">mạnh mẽ &amp; chuyên nghiệp</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              TJCRM giúp doanh nghiệp của bạn quản lý khách hàng, nhân sự và
              vận hành trong một nền tảng duy nhất.
            </p>
          </div>

          <ul className="flex flex-col gap-5">
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-2 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © 2026 TJCRM. Đã đăng ký bản quyền.
        </p>
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-7 lg:hidden">
          <Logo />
        </div>

        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="glass-panel rounded-2xl p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="mb-7">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
