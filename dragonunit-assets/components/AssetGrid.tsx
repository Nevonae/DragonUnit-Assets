import { AssetCard } from "@/components/AssetCard";

type AssetRecord = {
  id: string;
  title: string;
  category: string;
  mime_type: string;
  file_size: number;
  views: number;
  downloads: number;
  created_at: string;
  thumbnail_path?: string | null;
};

export function AssetGrid({
  assets,
  savedAssetIds = [],
  canSave = false,
  emptyTitle = "No Assets Yet",
  emptyDescription = "The DragonUnit library is waiting for its first upload from the owner or administrators.",
}: {
  assets: AssetRecord[];
  savedAssetIds?: string[];
  canSave?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const savedAssets = new Set(savedAssetIds);

  if (!assets.length) {
    return (
      <div className="asset-results-enter rounded-2xl border border-dashed border-[#252A35] bg-[#10131A] p-10 text-center">
        <h3 className="text-2xl font-semibold text-[#F5F7FA]">{emptyTitle}</h3>
        <p className="mt-3 text-[#9AA1AE]">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="asset-results-enter grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          id={asset.id}
          title={asset.title}
          category={asset.category}
          mimeType={asset.mime_type}
          fileSize={asset.file_size}
          views={asset.views}
          downloads={asset.downloads}
          createdAt={asset.created_at}
          thumbnail={asset.thumbnail_path || null}
          isSaved={savedAssets.has(asset.id)}
          canSave={canSave}
        />
      ))}
    </div>
  );
}
