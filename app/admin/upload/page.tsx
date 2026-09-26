import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function UploadAssetPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AdminSidebar />
          <div className="rounded-3xl border border-[#252A35] bg-[#10131A] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">Upload</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#F5F7FA]">Upload asset</h1>
            <form className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-[#9AA1AE]">Title</label>
                <input className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] px-4 py-3 text-[#F5F7FA] outline-none focus:border-[#8B5CF6]" placeholder="Asset title" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#9AA1AE]">Description</label>
                <textarea className="min-h-[120px] w-full rounded-xl border border-[#252A35] bg-[#0D0F15] px-4 py-3 text-[#F5F7FA] outline-none focus:border-[#8B5CF6]" placeholder="Tell creators what this asset includes" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[#9AA1AE]">Category</label>
                  <select className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] px-4 py-3 text-[#F5F7FA] outline-none focus:border-[#8B5CF6]">
                    <option>Anime Clips</option>
                    <option>SFX</option>
                    <option>Presets</option>
                    <option>Project Files</option>
                    <option>Overlays</option>
                    <option>CC</option>
                    <option>Lili_2.0 Remake Clip</option>
                    <option>Nevonae Remake Clip</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[#9AA1AE]">File</label>
                  <input type="file" className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] px-4 py-3 text-[#F5F7FA] file:mr-3 file:rounded-full file:border-0 file:bg-[#8B5CF6] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#9AA1AE]">Optional Thumbnail</label>
                <input type="file" className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] px-4 py-3 text-[#F5F7FA] file:mr-3 file:rounded-full file:border-0 file:bg-[#8B5CF6] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white" />
              </div>
              <button type="submit" className="rounded-full bg-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7c4ae9]">
                Upload asset
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
