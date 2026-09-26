import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Download, Heart, ShieldCheck } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfileActions } from "@/components/ProfileActions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDate, formatFileSize } from "@/lib/constants";
import { redirect } from "next/navigation";

const profileTabs = [
  { label: "Details", href: "/dashboard/profile" },
  { label: "Activity", href: "/dashboard/downloads" },
  { label: "Inventory", href: "/dashboard/wishlist" },
  { label: "Password and security", href: "/dashboard/settings" },
];

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileResult, downloadsResult, wishlistResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, role, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("download_events")
      .select("id, created_at, assets(title, category, file_size)", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("wishlists")
      .select("asset_id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const profile = profileResult.data;
  const displayName = user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? profile?.display_name ?? "Member";
  const bio = user.user_metadata?.bio ?? "";
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? "";
  const bannerUrl = user.user_metadata?.banner_url ?? "";
  const role = profile?.role ?? "member";
  const joined = profile?.created_at ?? user.created_at;
  const publicId = user.id.replaceAll("-", "").slice(0, 8).toUpperCase();
  const initials = displayName.trim().split(/\s+/).slice(0, 2).map((part: string) => part[0]).join("").toUpperCase();
  const downloads = downloadsResult.data ?? [];
  const downloadCount = downloadsResult.error ? null : downloadsResult.count;
  const wishlistCount = wishlistResult.error ? null : wishlistResult.count;

  return (
    <DashboardLayout>
      <section className="overflow-hidden rounded-2xl border border-[#252A35] bg-[#10131A]">
        <div className="relative aspect-[3.4/1] min-h-32 max-h-64 overflow-hidden bg-[#0D0F15]">
          {bannerUrl ? (
            <Image src={bannerUrl} alt="Profile banner" fill unoptimized className="object-cover" priority />
          ) : (
            <div className="grid-pattern absolute inset-0 opacity-70" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#10131A] to-transparent" />
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="relative -mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-[#10131A] bg-[#1B1827] text-2xl font-semibold text-[#E9D5FF] sm:size-28">
              {initials || "DU"}
              {avatarUrl && <Image src={avatarUrl} alt={`${displayName} profile photo`} fill unoptimized className="object-cover" />}
            </div>
            <ProfileActions initialValues={{
              displayName,
              bio,
              avatarUrl,
              bannerUrl,
            }} />
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-2xl font-semibold text-[#F5F7FA]">{displayName}</h1>
              <span className="inline-flex items-center gap-2 rounded-lg border border-[#0B6877]/50 bg-[#0B6877]/10 px-3 py-1.5 font-mono text-xs text-[#B9E8ED]">
                <span className="font-sans text-[10px] uppercase tracking-wide text-[#8B9CA2]">Member ID</span>
                #{publicId}
              </span>
            </div>
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-[#9AA1AE]">{bio || "No bio added yet."}</p>
          </div>
        </div>
      </section>

      <section aria-label="Profile statistics" className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#252A35] bg-[#10131A] sm:grid-cols-4">
        <div className="border-b border-r border-[#252A35] p-4 text-center sm:border-b-0">
          <p className="text-xl font-semibold text-[#F5F7FA]">{role}</p>
          <p className="mt-1 text-xs text-[#737B89]">Role</p>
        </div>
        <div className="border-b border-[#252A35] p-4 text-center sm:border-b-0 sm:border-r">
          <p className="text-xl font-semibold text-[#F5F7FA]">{downloadCount ?? "—"}</p>
          <p className="mt-1 text-xs text-[#737B89]">Downloads</p>
        </div>
        <div className="border-r border-[#252A35] p-4 text-center">
          <p className="text-xl font-semibold text-[#F5F7FA]">{wishlistCount ?? "—"}</p>
          <p className="mt-1 text-xs text-[#737B89]">Saved assets</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-sm font-semibold text-[#F5F7FA]">{formatDate(joined)}</p>
          <p className="mt-1 text-xs text-[#737B89]">Member since</p>
        </div>
      </section>

      <nav aria-label="Profile sections" className="flex gap-1 overflow-x-auto border-b border-[#252A35]">
        {profileTabs.map((tab, index) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={index === 0 ? "page" : undefined}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm transition ${index === 0 ? "border-[#0B8797] text-[#F5F7FA]" : "border-transparent text-[#858A99] hover:text-white"}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#252A35] bg-[#10131A] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737B89]">Activity</p>
              <h2 className="mt-1 text-lg font-semibold text-[#F5F7FA]">Recent downloads</h2>
            </div>
            <Link href="/dashboard/downloads" className="text-sm text-[#27B2C2] transition hover:text-[#78E0EA]">View all</Link>
          </div>
          {downloads.length ? (
            <div className="mt-5 divide-y divide-[#252A35]">
              {downloads.map((download) => {
                const asset = download.assets[0];
                return (
                  <div key={download.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#E7E9EF]">{asset?.title ?? "Unavailable asset"}</p>
                      <p className="mt-1 text-xs text-[#737B89]">{asset?.category ?? "Asset"}{asset ? ` · ${formatFileSize(Number(asset.file_size))}` : ""}</p>
                    </div>
                    <time dateTime={download.created_at} className="shrink-0 text-xs text-[#737B89]">{formatDate(download.created_at)}</time>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-[#303342] px-4 py-6 text-center">
              <p className="text-sm text-[#A6A9B3]">No downloads yet</p>
              <Link href="/assets" className="mt-2 inline-block text-sm text-[#27B2C2] hover:text-[#78E0EA]">Browse assets</Link>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#252A35] bg-[#10131A] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737B89]">About</p>
          <h2 className="mt-1 text-lg font-semibold text-[#F5F7FA]">Account</h2>
          <dl className="mt-5 divide-y divide-[#252A35] text-sm">
            <div className="flex items-center justify-between gap-3 py-3 first:pt-0">
              <dt className="text-[#858A99]">Email</dt>
              <dd className="max-w-[65%] truncate text-right text-[#D6D9E0]">{user.email ?? "Not provided"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <dt className="inline-flex items-center gap-2 text-[#858A99]"><ShieldCheck className="size-4" /> Role</dt>
              <dd className="capitalize text-[#D6D9E0]">{role}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-3 last:pb-0">
              <dt className="inline-flex items-center gap-2 text-[#858A99]"><CalendarDays className="size-4" /> Joined</dt>
              <dd className="text-[#D6D9E0]">{formatDate(joined)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </DashboardLayout>
  );
}