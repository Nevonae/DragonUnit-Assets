"use client";

import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="group flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#252A35] bg-[#0D0F15] px-4 text-[#9AA1AE] transition duration-200 focus-within:border-[#8B5CF6]/70 focus-within:ring-2 focus-within:ring-[#8B5CF6]/15"
    >
      <Search className="size-4 shrink-0 transition-colors group-focus-within:text-[#C4B5FD]" />
      <input
        aria-label="Search assets"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, category, or description"
        className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-[#F5F7FA] outline-none placeholder:text-[#737B89]"
      />
      <button type="submit" className="shrink-0 rounded-lg bg-[#F5F7FA] px-4 py-2 text-sm font-semibold text-[#10131A] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]">
        Search
      </button>
    </form>
  );
}
