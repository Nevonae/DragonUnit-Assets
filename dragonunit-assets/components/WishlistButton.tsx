"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function WishlistButton({
  assetId,
  title,
  initialSaved,
  canSave,
}: {
  assetId: string;
  title: string;
  initialSaved: boolean;
  canSave: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setSaved(initialSaved), [initialSaved]);

  async function toggleWishlist(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError("");

    if (!canSave) {
      router.push("/login");
      return;
    }

    if (pending) return;
    setPending(true);

    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { error: saveError } = saved
        ? await supabase
            .from("wishlists")
            .delete()
            .eq("user_id", user.id)
            .eq("asset_id", assetId)
        : await supabase
            .from("wishlists")
            .insert({ user_id: user.id, asset_id: assetId });

      if (saveError) {
        setError("Wishlist update failed");
        return;
      }

      setSaved(!saved);
      router.refresh();
    } catch {
      setError("Wishlist update failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="absolute right-3 top-3 z-20">
      <button
        type="button"
        onClick={toggleWishlist}
        disabled={pending}
        aria-label={canSave ? `${saved ? "Remove" : "Add"} ${title} ${saved ? "from" : "to"} wishlist` : `Sign in to save ${title}`}
        aria-pressed={saved}
        title={canSave ? (saved ? "Remove from wishlist" : "Add to wishlist") : "Sign in to save this asset"}
        className="grid size-10 place-items-center rounded-full border border-white/10 bg-[#08090D]/75 text-white shadow-lg backdrop-blur transition hover:border-[#F472B6]/60 hover:bg-[#17131B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F472B6] disabled:cursor-wait disabled:opacity-60"
      >
        <Heart className={`size-4 transition ${saved ? "fill-[#F472B6] text-[#F472B6]" : "text-white"}`} />
      </button>
      {error && <span role="alert" className="absolute right-0 top-12 whitespace-nowrap rounded-md border border-red-500/30 bg-[#10131A] px-2 py-1 text-xs text-red-300">{error}</span>}
    </span>
  );
}