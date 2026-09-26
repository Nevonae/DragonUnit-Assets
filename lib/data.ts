import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ASSET_CATEGORIES } from "@/lib/constants";

type AssetRow = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  storage_path: string;
  thumbnail_path?: string | null;
  file_name: string;
  file_size: number;
  mime_type: string;
  downloads: number;
  views: number;
  created_by: string;
  created_at: string;
};

export async function getAssetStats() {
  const supabase = await createServerSupabaseClient();
  const { count: memberCount, error: profileError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { data: assetData, error: assetError } = await supabase
    .from("assets")
    .select("downloads, views")
    .order("created_at", { ascending: false });

  const members = profileError ? 0 : (memberCount ?? 0);
  const assets = assetError ? [] : (assetData ?? []);
  const downloads = assets.reduce((sum, asset) => sum + Number(asset.downloads || 0), 0);
  const views = assets.reduce((sum, asset) => sum + Number(asset.views || 0), 0);

  return { members, assets: assets.length, downloads, views };
}

export async function getAssets(params?: { category?: string; search?: string; sort?: string }) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("assets").select("*");

  if (params?.category && params.category !== "All") {
    query = query.eq("category", params.category);
  }

  if (params?.search) {
    const search = params.search.trim();
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }
  }

  if (params?.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (params?.sort === "most-viewed") {
    query = query.order("views", { ascending: false });
  } else if (params?.sort === "most-downloaded") {
    query = query.order("downloads", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error || !data) return [] as AssetRow[];
  return data as AssetRow[];
}

export async function getAssetById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("assets").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as AssetRow;
}

export async function getPublicStats() {
  return getAssetStats();
}

export const categoryOptions = ["All", ...ASSET_CATEGORIES];
