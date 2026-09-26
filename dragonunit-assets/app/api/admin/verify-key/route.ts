import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const configuredKey = process.env.ADMIN_ACCESS_KEY;
  if (!configuredKey || Buffer.byteLength(configuredKey) < 32) {
    return NextResponse.json(
      { error: "Admin access is not configured. Contact the site owner." },
      { status: 503 },
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in before verifying admin access." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "owner"].includes(profile.role)) {
    return NextResponse.json({ error: "This account does not have administrator access." }, { status: 403 });
  }

  let suppliedKey: unknown;
  try {
    suppliedKey = (await request.json()).key;
  } catch {
    return NextResponse.json({ error: "Enter a valid admin access key." }, { status: 400 });
  }

  if (typeof suppliedKey !== "string" || suppliedKey.length > 4096) {
    return NextResponse.json({ error: "Enter a valid admin access key." }, { status: 400 });
  }

  const expectedBuffer = Buffer.from(configuredKey, "utf8");
  const suppliedBuffer = Buffer.from(suppliedKey, "utf8");
  const matches = suppliedBuffer.length === expectedBuffer.length
    && timingSafeEqual(suppliedBuffer, expectedBuffer);

  if (!matches) {
    return NextResponse.json({ error: "The admin access key is incorrect." }, { status: 401 });
  }

  const signature = createHmac("sha256", configuredKey).update(user.id).digest("hex");
  const response = NextResponse.json({ verified: true });
  response.cookies.set("dragonunit-admin-access", `${user.id}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 15 * 60,
  });

  return response;
}