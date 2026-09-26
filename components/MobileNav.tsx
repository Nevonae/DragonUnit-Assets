"use client";

import Link from "next/link";
import { COMMUNITY_INVITE_URL } from "@/lib/constants";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="border-t border-[#252A35] bg-[#0D0F15] md:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
        <Link href="/assets" onClick={onClose} className="text-sm text-[#9AA1AE]">Assets</Link>
        <Link href="/#categories" onClick={onClose} className="text-sm text-[#9AA1AE]">Categories</Link>
        <Link href="/#why-dragonunit" onClick={onClose} className="text-sm text-[#9AA1AE]">About</Link>
        <Link href="/login" onClick={onClose} className="rounded-full border border-[#252A35] bg-[#10131A] px-4 py-2 text-center text-sm font-medium text-[#F5F7FA]">Login</Link>
        <a href={COMMUNITY_INVITE_URL} target="_blank" rel="noopener noreferrer" onClick={onClose} className="rounded-full bg-[#8B5CF6] px-4 py-2 text-center text-sm font-semibold text-white">Join DragonUnit</a>
      </div>
    </div>
  );
}
