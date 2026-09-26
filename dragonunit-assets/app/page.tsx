import Link from "next/link";
import { ArrowRight, Check, Download, Eye, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Stats } from "@/components/Stats";
import { CategoryCard } from "@/components/CategoryCard";
import { ASSET_CATEGORIES, COMMUNITY_INVITE_URL } from "@/lib/constants";
import { getPublicStats } from "@/lib/data";

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="grid-pattern absolute inset-0 opacity-30" />
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-16 text-center md:px-8 md:pt-20 lg:pt-24">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#252A35] bg-[#10131A]/80 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9AA1AE]">
              <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
              DRAGONUNIT ASSETS
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-[#F5F7FA] md:text-6xl">
              Premium Editing Assets for Creators
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[#9AA1AE] md:text-xl">
              Anime clips, SFX, presets, project files, overlays and creative resources — organized in one place.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/assets" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7c4ae9]">
                Explore Assets <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={COMMUNITY_INVITE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-[#252A35] bg-[#10131A] px-6 py-3 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#8B5CF6]">
                Join DragonUnit
              </a>
            </div>
          </div>
        </section>

        <Stats members={stats.members} assets={stats.assets} downloads={stats.downloads} views={stats.views} />

        <section id="categories" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[#9AA1AE]">Library</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#F5F7FA]">Asset categories</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {ASSET_CATEGORIES.map((category) => (
              <CategoryCard key={category} title={category} />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[#9AA1AE]">Latest</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#F5F7FA]">Latest assets</h2>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-[#252A35] bg-[#10131A] p-8 text-center text-[#9AA1AE]">
            No assets have been uploaded yet. The library is ready for the first owner or admin upload.
          </div>
        </section>

        <section id="why-dragonunit" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.26em] text-[#9AA1AE]">Why DragonUnit</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#F5F7FA]">Built for creators who move fast</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[{
              icon: ShieldCheck,
              title: "Secure by design",
              text: "Private storage, signed previews, and server-side permission checks keep the library protected.",
            }, {
              icon: Zap,
              title: "Fast access",
              text: "Optimized asset browsing, filtered collections, and clean access flows keep work moving.",
            }, {
              icon: Download,
              title: "Real usage metrics",
              text: "Counts are sourced from the database so success, downloads, and views stay accurate in real time.",
            }].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6 card-hover">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#252A35] bg-[#0D0F15] text-[#8B5CF6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F5F7FA]">{item.title}</h3>
                  <p className="mt-3 text-[#9AA1AE]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
          <div className="rounded-3xl border border-[#252A35] bg-[#10131A] px-6 py-10 text-center md:px-10">
            <p className="text-xs uppercase tracking-[0.26em] text-[#9AA1AE]">Ready when you are</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#F5F7FA]">Build your library with the right assets</h2>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/assets" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7c4ae9]">
                Explore Assets <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={COMMUNITY_INVITE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-[#252A35] bg-[#0D0F15] px-6 py-3 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#8B5CF6]">
                Join DragonUnit
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
