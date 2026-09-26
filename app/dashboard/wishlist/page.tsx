import { DashboardLayout } from "@/components/DashboardLayout";
import { AssetGrid } from "@/components/AssetGrid";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: wishlist, error } = await supabase
    .from("wishlists")
    .select("assets(id, title, category, mime_type, file_size, views, downloads, created_at, thumbnail_path)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const assets = wishlist?.flatMap((item) => item.assets) ?? [];
  const savedAssetIds = assets.map((asset) => asset.id);

  return (
    <DashboardLayout>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#9AA1AE]">Member</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#F5F7FA]">Wishlist</h1>
      </div>
      {error ? (
        <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
          Your wishlist could not be loaded. Apply the wishlist SQL setup and try again.
        </div>
      ) : (
        <AssetGrid
          assets={assets}
          savedAssetIds={savedAssetIds}
          canSave
          emptyTitle="Your wishlist is empty"
          emptyDescription="Save assets with the heart button to keep them here."
        />
      )}
    </DashboardLayout>
  );
}