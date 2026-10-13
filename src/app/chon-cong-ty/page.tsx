import { CompanyPicker } from "@/components/companies/company-picker";
import { getCurrentUser } from "@/lib/auth";
import { getUserCompanies } from "@/lib/companies";
import { redirect } from "next/navigation";

export default async function ChonCongTyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/dang-nhap?redirect=/chon-cong-ty");

  const companies = await getUserCompanies();

  return <CompanyPicker companies={companies} userName={user.fullName} />;
}
