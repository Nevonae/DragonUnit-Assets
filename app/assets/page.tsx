import { AssetBrowser } from "@/components/AssetBrowser";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getAssets, getPublicStats } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Box, Download, Eye, Users } from "lucide-react";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  const category = resolved.category ?? "All";
  const search = resolved.q ?? "";
  const sort = resolved.sort ?? "newest";

  const [assets, stats] = await Promise.all([
    getAssets({ category, search, sort }),
    getPublicStats(),
  ]);
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  let savedAssetIds: string[] = [];

  if (user) {
    const { data } = await supabase
      .from("wishlists")
      .select("asset_id")
      .eq("user_id", user.id);
    savedAssetIds = data?.map((item) => item.asset_id) ?? [];
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <section className="relative overflow-hidden border-b border-[#252A35]/70">
          <div className="grid-pattern absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 text-center md:px-8 md:pt-16">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#A6A9B3]">DragonUnit library</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#F5F7FA] sm:text-5xl">
              Active <span className="text-[#9B73FF]">Resources</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#9AA1AE] sm:text-lg">
              Browse, filter, and open creator assets. Search by title, category, or description.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
              {[
                { label: "ASSETS", value: stats.assets.toLocaleString(), icon: Box, accent: true },
                { label: "DOWNLOADS", value: stats.downloads.toLocaleString(), icon: Download },
                { label: "VIEWS", value: stats.views.toLocaleString(), icon: Eye },
                { label: "MEMBERS", value: stats.members.toLocaleString(), icon: Users },
              ].map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="rounded-xl border border-[#252A35] bg-[#10131A]/90 p-4">
                  <div className="flex items-center gap-2 text-[10px] font-medium tracking-[0.12em] text-[#737B89]">
                    <Icon className={`size-3.5 ${accent ? "text-[#9B73FF]" : "text-[#858A99]"}`} /> {label}
                  </div>
                  <p className={`mt-2 text-2xl font-semibold ${accent ? "text-[#9B73FF]" : "text-[#F5F7FA]"}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <AssetBrowser initialAssets={assets} savedAssetIds={savedAssetIds} canSave={Boolean(user)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
