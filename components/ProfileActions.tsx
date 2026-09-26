"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, MoreHorizontal, PencilLine, Settings, Download, Heart } from "lucide-react";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";

type ProfileValues = {
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
};

export function ProfileActions({ initialValues }: { initialValues: ProfileValues }) {
  const router = useRouter();
  const [editing, setEditing] = useState<"name" | "avatar" | null>(null);

  function closeEditor() {
    setEditing(null);
  }

  function handleSaved() {
    closeEditor();
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing("avatar")}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0B8797] px-4 text-sm font-semibold text-white transition hover:bg-[#0D98A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <Camera className="size-4" /> Customize avatar
        </button>
        <button
          type="button"
          onClick={() => setEditing("name")}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#303342] px-4 text-sm font-medium text-[#D6D9E0] transition hover:border-[#0B8797]/60 hover:bg-[#1A1B23] hover:text-white"
        >
          <PencilLine className="size-4" /> Edit profile
        </button>
        <details className="group relative">
          <summary aria-label="More profile actions" className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-[#303342] text-[#9AA1AE] transition hover:bg-[#1A1B23] hover:text-white [&::-webkit-details-marker]:hidden">
            <MoreHorizontal className="size-5" />
          </summary>
          <nav aria-label="More profile pages" className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-[#303342] bg-[#111218] p-1.5 shadow-xl">
            <Link href="/dashboard/downloads" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D6D9E0] hover:bg-[#1A1B23] hover:text-white"><Download className="size-4" /> Downloads</Link>
            <Link href="/dashboard/wishlist" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D6D9E0] hover:bg-[#1A1B23] hover:text-white"><Heart className="size-4" /> Wishlist</Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D6D9E0] hover:bg-[#1A1B23] hover:text-white"><Settings className="size-4" /> Password and security</Link>
          </nav>
        </details>
      </div>
      <ProfileEditDialog
        open={editing !== null}
        initialTab={editing ?? "name"}
        initialValues={initialValues}
        onClose={closeEditor}
        onSaved={handleSaved}
      />
    </>
  );
}