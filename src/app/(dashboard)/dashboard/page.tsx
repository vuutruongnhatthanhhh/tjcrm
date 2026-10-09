import { DepartmentBars } from "@/components/dashboard/department-bars";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Briefcase, DollarSign, UserCheck, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Tổng quan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chào mừng trở lại, đây là tình hình hoạt động của doanh nghiệp hôm nay.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng nhân viên"
          value="128"
          change="4.2%"
          trend="up"
          icon={Users}
        />
        <StatCard
          label="Đang làm việc"
          value="115"
          change="1.8%"
          trend="up"
          icon={UserCheck}
        />
        <StatCard
          label="Doanh thu tháng"
          value="1.248 tr"
          change="12.6%"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="Dự án đang chạy"
          value="23"
          change="2.1%"
          trend="down"
          icon={Briefcase}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <DepartmentBars />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="glass-panel rounded-2xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground">
            Việc cần xử lý
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              { label: "Duyệt đơn nghỉ phép", count: 5 },
              { label: "Hồ sơ nhân viên mới chờ xác nhận", count: 3 },
              { label: "Hợp đồng sắp hết hạn", count: 2 },
            ].map((t) => (
              <li
                key={t.label}
                className="flex items-center justify-between rounded-lg bg-surface-2 px-3.5 py-2.5 transition-colors hover:bg-surface-hover"
              >
                <span className="text-sm text-foreground">{t.label}</span>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {t.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
