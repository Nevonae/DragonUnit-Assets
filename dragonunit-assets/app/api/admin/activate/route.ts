import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const configuredKey = process.env.ADMIN_ACCESS_KEY;
  if (!configuredKey || Buffer.byteLength(configuredKey) < 32) {
    return NextResponse.json(
      { error: "Admin promotion is not configured. Contact the site owner." },
      { status: 503 },
    );
  }

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
  }

  const userClient = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Sign in before activating admin access." }, { status: 401 });
  }

  let submittedKey: unknown;
  try {
    submittedKey = (await request.json()).key;
  } catch {
    return NextResponse.json({ error: "Enter a valid admin access key." }, { status: 400 });
  }

  if (typeof submittedKey !== "string" || submittedKey.length > 4096) {
    return NextResponse.json({ error: "Enter a valid admin access key." }, { status: 400 });
  }

  const expected = Buffer.from(configuredKey, "utf8");
  const submitted = Buffer.from(submittedKey, "utf8");
  if (expected.length !== submitted.length || !timingSafeEqual(expected, submitted)) {
    return NextResponse.json({ error: "The admin access key is incorrect." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await userClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: "Could not verify your profile." }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Your profile was not found." }, { status: 404 });
  }

  let role = profile.role;
  if (role === "member") {
    try {
      const adminClient = createSupabaseAdminClient();
      const { data: promotedProfile, error: promoteError } = await adminClient
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id)
        .eq("role", "member")
        .select("role")
        .maybeSingle();

      if (promoteError) {
        return NextResponse.json({ error: "Admin promotion failed. Please contact the site owner." }, { status: 500 });
      }
      if (!promotedProfile) {
        return NextResponse.json({ error: "Your profile role changed. Sign in again and retry." }, { status: 409 });
      }
      role = promotedProfile.role;
    } catch {
      return NextResponse.json({ error: "Admin promotion is not configured on the server." }, { status: 503 });
    }
  } else if (role !== "admin" && role !== "owner") {
    return NextResponse.json({ error: "This profile cannot be promoted." }, { status: 403 });
  }

  const signature = createHmac("sha256", configuredKey).update(user.id).digest("hex");
  const response = NextResponse.json({ success: true, role });
  response.cookies.set("dragonunit-admin-access", `${user.id}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 15 * 60,
  });
  return response;
}