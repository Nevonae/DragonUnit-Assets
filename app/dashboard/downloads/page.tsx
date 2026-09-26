import { DashboardLayout } from "@/components/DashboardLayout";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDate, formatFileSize } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function DownloadsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: downloads, error } = await supabase
    .from("download_events")
    .select("id, created_at, assets(title, category, file_name, file_size)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#9AA1AE]">Member</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#F5F7FA]">Downloads</h1>
      </div>
      {error ? (
        <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
          Your download history could not be loaded.
        </div>
      ) : downloads?.length ? (
        <div className="overflow-hidden rounded-2xl border border-[#252A35] bg-[#10131A]">
          {downloads.map((download) => {
            const asset = download.assets[0];
            return (
              <div key={download.id} className="flex flex-col gap-2 border-b border-[#252A35] p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-medium text-[#F5F7FA]">{asset?.title ?? "Unavailable asset"}</h2>
                  <p className="mt-1 text-sm text-[#9AA1AE]">{asset?.category ?? "Asset"} · {asset?.file_name ?? "File removed"}</p>
                </div>
                <div className="flex gap-4 text-sm text-[#737B89] sm:text-right">
                  <span>{asset ? formatFileSize(Number(asset.file_size)) : ""}</span>
                  <time dateTime={download.created_at}>{formatDate(download.created_at)}</time>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#252A35] bg-[#10131A] p-8 text-center">
          <h2 className="font-semibold text-[#F5F7FA]">No downloads yet</h2>
          <p className="mt-2 text-sm text-[#9AA1AE]">Assets you download will appear here.</p>
        </div>
      )}
    </DashboardLayout>
  );
}