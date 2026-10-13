import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const user = await getCurrentUser();
  redirect(user ? "/chon-cong-ty" : "/dang-nhap");
}
