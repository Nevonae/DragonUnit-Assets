"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AssetGrid } from "@/components/AssetGrid";
import { FilterBar } from "@/components/FilterBar";
import { SearchBar } from "@/components/SearchBar";

type AssetRecord = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  mime_type: string;
  file_size: number;
  views: number;
  downloads: number;
  created_at: string;
  thumbnail_path?: string | null;
};

export function AssetBrowser({
  initialAssets,
  savedAssetIds,
  canSave,
}: {
  initialAssets: AssetRecord[];
  savedAssetIds: string[];
  canSave: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");

  const filteredAssets = useMemo(() => {
    let items = [...initialAssets];

    if (category !== "All") {
      items = items.filter((asset) => asset.category === category);
    }

    if (localSearch.trim()) {
      const query = localSearch.trim().toLowerCase();
      items = items.filter((asset) => {
        const haystack = `${asset.title} ${asset.category} ${asset.description || ""}`.toLowerCase();
        return haystack.includes(query);
      });
    }

    items.sort((a, b) => {
      if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === "most-viewed") return Number(b.views) - Number(a.views);
      if (sort === "most-downloaded") return Number(b.downloads) - Number(a.downloads);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return items;
  }, [category, initialAssets, localSearch, sort]);

  const applyQuery = (nextCategory: string, nextSort: string, nextSearch: string) => {
    const params = new URLSearchParams();
    if (nextCategory && nextCategory !== "All") params.set("category", nextCategory);
    if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
    if (nextSearch.trim()) params.set("q", nextSearch.trim());
    router.push(`/assets${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <>
      <div className="asset-controls-enter mb-8 space-y-5">
        <section className="mx-auto max-w-3xl rounded-2xl border border-[#252A35] bg-[#10131A]/70 p-4 shadow-[0_14px_45px_rgba(0,0,0,0.18)] sm:p-5">
          <SearchBar value={localSearch} onChange={setLocalSearch} onSubmit={() => applyQuery(category, sort, localSearch)} />
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#737B89]">
            <span className="mr-1">Quick categories</span>
            {["Anime Clips", "SFX", "Presets", "Project Files"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  applyQuery(item, sort, localSearch);
                }}
                className="rounded-full border border-[#252A35] px-2.5 py-1 text-[#9AA1AE] transition hover:border-[#8B5CF6]/50 hover:text-white"
              >
                + {item}
              </button>
            ))}
          </div>
        </section>
        <FilterBar
          category={category}
          sort={sort}
          onCategoryChange={(value) => {
            setCategory(value);
            applyQuery(value, sort, localSearch);
          }}
          onSortChange={(value) => {
            setSort(value);
            applyQuery(category, value, localSearch);
          }}
        />
      </div>
      <AssetGrid assets={filteredAssets} savedAssetIds={savedAssetIds} canSave={canSave} />
    </>
  );
}
