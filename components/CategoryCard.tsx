import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Clapperboard,
  FileArchive,
  Film,
  Layers3,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "Anime Clips": Film,
  SFX: AudioLines,
  Presets: Sparkles,
  "Project Files": FileArchive,
  Overlays: Layers3,
  CC: Palette,
  "Lili_2.0 Remake Clip": Wand2,
  "Nevonae Remake Clip": Clapperboard,
};

const descriptions: Record<string, string> = {
  "Anime Clips": "High-energy footage for stylized edits and motion stories.",
  SFX: "Sound design layers for transitions, hits, and cinematic impact.",
  Presets: "Ready-to-use creative looks built for faster editing workflows.",
  "Project Files": "Organized session bundles for efficient editorial pipelines.",
  Overlays: "Textural transitions, stylized layers, and finishing effects.",
  CC: "Color grades and correction tools to sharpen your look.",
  "Lili_2.0 Remake Clip": "Remastered anime-focused visual fragments with editorial polish.",
  "Nevonae Remake Clip": "Narrative-ready remade clips tuned for montage and motion work.",
};

export function CategoryCard({ title }: { title: string }) {
  const Icon = icons[title] ?? Sparkles;

  return (
    <Link
      href={`/assets?category=${encodeURIComponent(title)}`}
      className="card-hover group flex h-full flex-col rounded-2xl border border-[#252A35] bg-[#10131A] p-6"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#252A35] bg-[#0D0F15] text-[#8B5CF6]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-semibold text-[#F5F7FA]">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-[#9AA1AE]">{descriptions[title]}</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#F5F7FA]">
        Explore <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
