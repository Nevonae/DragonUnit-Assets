import Link from "next/link";
import { Download, Eye, FolderArchive } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/constants";
import { WishlistButton } from "@/components/WishlistButton";

type AssetCardProps = {
  id: string;
  title: string;
  category: string;
  mimeType: string;
  fileSize: number;
  views: number;
  downloads: number;
  createdAt: string;
  thumbnail?: string | null;
  isSaved: boolean;
  canSave: boolean;
};

export function AssetCard({
  id,
  title,
  category,
  mimeType,
  fileSize,
  views,
  downloads,
  createdAt,
  thumbnail,
  isSaved,
  canSave,
}: AssetCardProps) {
  const fileType = mimeType?.split("/")[1]?.toUpperCase() || "FILE";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#252A35] bg-[#10131A] card-hover">
      <div className="relative h-48 border-b border-[#252A35] bg-[#0D0F15]">
        <Link href={`/assets/${id}`} aria-label={`View ${title}`} className="absolute inset-0 z-0">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[#9AA1AE]">
              <FolderArchive className="h-10 w-10" />
            </div>
          )}
        </Link>
        <WishlistButton assetId={id} title={title} initialSaved={isSaved} canSave={canSave} />
      </div>
      <Link href={`/assets/${id}`} className="block">
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-[#252A35] bg-[#0D0F15] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#9AA1AE]">
              {category}
            </span>
            <span className="text-xs text-[#9AA1AE]">{fileType}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#F5F7FA]">{title}</h3>
            <p className="mt-2 text-xs text-[#9AA1AE]">{formatDate(createdAt)}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-[#9AA1AE]">
            <span>{formatFileSize(fileSize)}</span>
            <span>{views} views</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#252A35] pt-4 text-xs text-[#9AA1AE]">
            <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {views}</span>
            <span className="inline-flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> {downloads}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
