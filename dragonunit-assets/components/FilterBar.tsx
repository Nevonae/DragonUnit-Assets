"use client";

import { ASSET_CATEGORIES } from "@/lib/constants";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export function FilterBar({
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: {
  category: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-5 border-b border-[#252A35] pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div role="group" aria-label="Filter assets by category" className="flex min-w-0 flex-1 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange("All")}
          aria-pressed={category === "All"}
          className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 py-2 text-sm font-medium transition duration-200 hover:border-[#8B5CF6]/50 hover:text-[#F5F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/70 active:scale-[0.98] ${
            category === "All"
              ? "border-[#8B5CF6]/50 bg-[#8B5CF6]/12 text-[#F5F7FA] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.08)]"
              : "border-[#252A35] bg-[#10131A]/70 text-[#9AA1AE]"
          }`}
        >
          {category === "All" && <span aria-hidden="true" className="mr-2 size-1.5 rounded-full bg-[#A78BFA]" />}
          All
        </button>
        {ASSET_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            aria-pressed={category === item}
            className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 py-2 text-sm font-medium transition duration-200 hover:border-[#8B5CF6]/50 hover:text-[#F5F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/70 active:scale-[0.98] ${
              category === item
                ? "border-[#8B5CF6]/50 bg-[#8B5CF6]/12 text-[#F5F7FA] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.08)]"
                : "border-[#252A35] bg-[#10131A]/70 text-[#9AA1AE]"
            }`}
          >
            {category === item && <span aria-hidden="true" className="mr-2 size-1.5 rounded-full bg-[#A78BFA]" />}
            {item}
          </button>
        ))}
      </div>

      <div className="relative w-full shrink-0 sm:w-48">
        <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#9AA1AE]" />
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-[#252A35] bg-[#10131A] py-3 pl-10 pr-10 text-sm text-[#F5F7FA] outline-none transition duration-200 hover:border-[#8B5CF6]/50 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
          aria-label="Sort assets"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-viewed">Most Viewed</option>
          <option value="most-downloaded">Most Downloaded</option>
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA1AE]" />
      </div>
    </div>
  );
}
