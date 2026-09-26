import { DashboardLayout } from "@/components/DashboardLayout";
import { SecuritySettingsForm } from "@/components/SecuritySettingsForm";
import { SignOutButton } from "@/components/SignOutButton";
import { AdminPromotionForm } from "@/components/AdminPromotionForm";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <DashboardLayout>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#9AA1AE]">Member</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#F5F7FA]">Password and security</h1>
      </div>
      <SecuritySettingsForm />
      {profile?.role === "member" && <AdminPromotionForm />}
      <section className="rounded-2xl border border-red-500/20 bg-[#10131A] p-6">
        <h2 className="text-lg font-semibold text-[#F5F7FA]">Sign out</h2>
        <p className="mt-2 text-sm text-[#9AA1AE]">End your current DragonUnit session.</p>
        <div className="mt-5 border-t border-[#252A35] pt-5">
          <SignOutButton />
        </div>
      </section>
    </DashboardLayout>
  );
}