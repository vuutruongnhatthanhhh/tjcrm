import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Kept in sync with lib/companies.ts's ACTIVE_COMPANY_COOKIE — duplicated
// (rather than imported) so this edge-runtime proxy never pulls in
// lib/supabase/server.ts's next/headers dependency, which is only valid
// inside Server Components/Route Handlers.
const ACTIVE_COMPANY_COOKIE = "active_company_id";

const PUBLIC_PATHS = [
  "/dang-nhap",
  "/dang-ky",
  "/quen-mat-khau",
  "/dat-lai-mat-khau",
  "/xac-nhan-email",
  "/thiet-lap-mat-khau",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase isn't configured yet (.env.local still empty) — let requests
  // through unauthenticated instead of crashing every page on dev start.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isPublic && pathname !== "/" && !user) {
    const loginUrl = new URL("/dang-nhap", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === "/dang-nhap" || pathname === "/dang-ky")) {
    return NextResponse.redirect(new URL("/chon-cong-ty", request.url));
  }

  // A user can belong to several companies, so /dashboard always needs an
  // active_company_id picked first — without it there's no company to
  // scope the dashboard's data to.
  if (user && pathname.startsWith("/dashboard") && !request.cookies.get(ACTIVE_COMPANY_COOKIE)) {
    return NextResponse.redirect(new URL("/chon-cong-ty", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|api).*)"],
};
