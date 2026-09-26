import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function hasValidAdminAccessCookie(cookie: string | undefined, userId: string, accessKey: string) {
  if (!cookie || !accessKey || new TextEncoder().encode(accessKey).byteLength < 32) return false;

  const [cookieUserId, suppliedSignature] = cookie.split(".");
  if (cookieUserId !== userId || !suppliedSignature) return false;

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(accessKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(userId));
  const expectedSignature = Array.from(new Uint8Array(signed), (byte) => byte.toString(16).padStart(2, "0")).join("");

  if (expectedSignature.length !== suppliedSignature.length) return false;
  let difference = 0;
  for (let index = 0; index < expectedSignature.length; index += 1) {
    difference |= expectedSignature.charCodeAt(index) ^ suppliedSignature.charCodeAt(index);
  }
  return difference === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin/login";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if ((isDashboardRoute || isAdminRoute) && !isAdminLogin) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL(isAdminRoute ? "/admin/login" : "/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile || !["admin", "owner"].includes(profile.role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      const hasAdminAccess = await hasValidAdminAccessCookie(
        request.cookies.get("dragonunit-admin-access")?.value,
        user.id,
        process.env.ADMIN_ACCESS_KEY ?? "",
      );
      if (!hasAdminAccess) {
        return NextResponse.redirect(new URL("/login?mode=admin", request.url));
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
