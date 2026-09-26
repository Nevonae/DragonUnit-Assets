type StatsProps = {
  members: number;
  assets: number;
  downloads: number;
  views: number;
};

const stats = [
  { label: "Members", key: "members" },
  { label: "Assets", key: "assets" },
  { label: "Downloads", key: "downloads" },
  { label: "Views", key: "views" },
] as const;

export function Stats({ members, assets, downloads, views }: StatsProps) {
  const values = { members, assets, downloads, views };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.key} className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6 card-hover">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9AA1AE]">{stat.label}</p>
            <p className="mt-5 text-3xl font-semibold text-[#F5F7FA]">{values[stat.key]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
