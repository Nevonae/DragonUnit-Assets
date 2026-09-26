import Link from "next/link";
import { Download, Eye, Calendar, FileText, Shield, ArrowLeft } from "lucide-react";
import { getAssetById } from "@/lib/data";
import { formatDate, formatFileSize } from "@/lib/constants";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await getAssetById(id);

  if (!asset) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8">
          <h1 className="text-3xl font-semibold text-[#F5F7FA]">Asset not found</h1>
          <Link href="/assets" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white">
            <ArrowLeft className="h-4 w-4" /> Return to library
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <Link href="/assets" className="mb-6 inline-flex items-center gap-2 text-sm text-[#9AA1AE] hover:text-[#F5F7FA]">
          <ArrowLeft className="h-4 w-4" /> Back to assets
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[#252A35] bg-[#10131A] p-4">
            <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-[#252A35] bg-[#0D0F15]">
              {asset.mime_type.startsWith("video/") ? (
                <video src={asset.storage_path} controls className="h-full w-full object-cover" />
              ) : asset.mime_type.startsWith("audio/") ? (
                <audio controls className="w-full max-w-xl" src={asset.storage_path} />
              ) : asset.mime_type.startsWith("image/") ? (
                <img src={asset.storage_path} alt={asset.title} className="h-full w-full object-cover" />
              ) : (
                <div className="text-center text-[#9AA1AE]">
                  <FileText className="mx-auto mb-3 h-10 w-10" />
                  <p className="text-lg font-medium text-[#F5F7FA]">{asset.file_name}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6 rounded-3xl border border-[#252A35] bg-[#10131A] p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">{asset.category}</p>
              <h1 className="mt-3 text-3xl font-semibold text-[#F5F7FA]">{asset.title}</h1>
            </div>
            <p className="text-[#9AA1AE]">{asset.description || "No description provided."}</p>

            <div className="grid gap-3 text-sm text-[#9AA1AE]">
              <div className="flex items-center justify-between border-b border-[#252A35] pb-3"><span>File type</span><span className="text-[#F5F7FA]">{asset.mime_type}</span></div>
              <div className="flex items-center justify-between border-b border-[#252A35] pb-3"><span>File size</span><span className="text-[#F5F7FA]">{formatFileSize(asset.file_size)}</span></div>
              <div className="flex items-center justify-between border-b border-[#252A35] pb-3"><span>Views</span><span className="inline-flex items-center gap-1.5 text-[#F5F7FA]"><Eye className="h-4 w-4" /> {asset.views}</span></div>
              <div className="flex items-center justify-between border-b border-[#252A35] pb-3"><span>Downloads</span><span className="inline-flex items-center gap-1.5 text-[#F5F7FA]"><Download className="h-4 w-4" /> {asset.downloads}</span></div>
              <div className="flex items-center justify-between"><span>Uploaded</span><span className="text-[#F5F7FA]">{formatDate(asset.created_at)}</span></div>
            </div>

            <button className="w-full rounded-full bg-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7c4ae9]">
              Download asset
            </button>
            <div className="rounded-2xl border border-[#252A35] bg-[#0D0F15] p-4 text-sm text-[#9AA1AE]">
              <div className="mb-2 flex items-center gap-2 text-[#F5F7FA]"><Shield className="h-4 w-4 text-[#8B5CF6]" /> Secure preview access</div>
              Protected previews and downloads are managed through signed Supabase URLs.
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
