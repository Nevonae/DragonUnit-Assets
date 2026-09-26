export const ASSET_CATEGORIES = [
  "Anime Clips",
  "SFX",
  "Presets",
  "Project Files",
  "Overlays",
  "CC",
  "Lili_2.0 Remake Clip",
  "Nevonae Remake Clip",
] as const;

export const COMMUNITY_INVITE_URL = "https://discord.gg/HKmuN37Z5";

export const SITE_COPY = {
  homeTitle: "Premium Editing Assets for Creators",
  homeDescription:
    "Anime clips, SFX, presets, project files, overlays and creative resources — organized in one place.",
};

export function formatFileSize(bytes: number | null | undefined) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}
