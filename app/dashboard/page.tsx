import { DashboardLayout } from "@/components/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
            <div className="rounded-3xl border border-[#252A35] bg-[#10131A] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9AA1AE]">Welcome</p>
              <h1 className="mt-3 text-3xl font-semibold text-[#F5F7FA]">Welcome back, creator</h1>
              <p className="mt-2 text-[#9AA1AE]">Your account profile, downloads, and asset activity will appear here.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6">
                <h2 className="text-lg font-semibold text-[#F5F7FA]">Account information</h2>
                <p className="mt-3 text-[#9AA1AE]">Role: member</p>
              </div>
              <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6">
                <h2 className="text-lg font-semibold text-[#F5F7FA]">Total downloads</h2>
                <p className="mt-3 text-3xl font-semibold text-[#F5F7FA]">0</p>
              </div>
            </div>
    </DashboardLayout>
  );
}
