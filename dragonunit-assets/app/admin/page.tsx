import { AdminSidebar } from "@/components/AdminSidebar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AdminSidebar />
          <section className="space-y-6">
            <div id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total Members", "0"],
                ["Total Assets", "0"],
                ["Total Downloads", "0"],
                ["Total Views", "0"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  id={label === "Total Downloads" ? "downloads" : undefined}
                  className="scroll-mt-24 rounded-2xl border border-[#252A35] bg-[#10131A] p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9AA1AE]">{label}</p>
                  <p className="mt-5 text-3xl font-semibold text-[#F5F7FA]">{value}</p>
                </div>
              ))}
            </div>
            <div id="assets" className="scroll-mt-24 rounded-2xl border border-[#252A35] bg-[#10131A] p-6">
              <h2 className="text-xl font-semibold text-[#F5F7FA]">Asset management</h2>
              <div className="mt-6 overflow-hidden rounded-xl border border-[#252A35]">
                <table className="min-w-full text-left text-sm text-[#9AA1AE]">
                  <thead className="bg-[#0D0F15] text-[#F5F7FA]">
                    <tr>
                      <th className="px-4 py-3">Asset</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Views</th>
                      <th className="px-4 py-3">Downloads</th>
                      <th className="px-4 py-3">Uploaded</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#252A35]">
                      <td className="px-4 py-3 text-[#F5F7FA]">No uploads yet</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">0</td>
                      <td className="px-4 py-3">0</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
