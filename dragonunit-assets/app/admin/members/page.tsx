import { AdminSidebar } from "@/components/AdminSidebar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AdminMembersPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AdminSidebar />
          <div className="rounded-3xl border border-[#252A35] bg-[#10131A] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">Members</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#F5F7FA]">Member management</h1>
            <div className="mt-6 overflow-hidden rounded-xl border border-[#252A35]">
              <table className="min-w-full text-left text-sm text-[#9AA1AE]">
                <thead className="bg-[#0D0F15] text-[#F5F7FA]">
                  <tr>
                    <th className="px-4 py-3">Display name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#252A35]">
                    <td className="px-4 py-3 text-[#F5F7FA]">No members yet</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
