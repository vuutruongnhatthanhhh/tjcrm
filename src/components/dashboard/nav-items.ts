import {
  BarChart3,
  Briefcase,
  Contact,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Nhân viên", href: "/dashboard/nhan-vien", icon: Users },
  { label: "Khách hàng", href: "/dashboard/khach-hang", icon: Contact, comingSoon: true },
  { label: "Dự án", href: "/dashboard/du-an", icon: Briefcase, comingSoon: true },
  { label: "Báo cáo", href: "/dashboard/bao-cao", icon: BarChart3, comingSoon: true },
  { label: "Cài đặt", href: "/dashboard/cai-dat", icon: Settings, comingSoon: true },
];
