"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Assets", href: "/admin#assets", section: "assets" },
  { label: "Upload Asset", href: "/admin/upload" },
  { label: "Members", href: "/admin/members" },
  { label: "Downloads", href: "/admin#downloads", section: "downloads" },
  { label: "Settings", href: "/dashboard/settings" },
];

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHash() {
  return window.location.hash.slice(1);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => "");

  return (
    <aside className="min-w-0 rounded-2xl border border-[#252A35] bg-[#10131A] p-4">
      <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">
        Admin Dashboard
      </p>
      <nav aria-label="Admin dashboard navigation" className="space-y-2">
        {adminLinks.map((item) => {
          const active = item.section
            ? pathname === "/admin" && hash === item.section
            : pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-xl border px-3 py-2 text-sm transition ${
                active
                  ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#F5F7FA]"
                  : "border-transparent text-[#9AA1AE] hover:border-[#252A35] hover:bg-[#0D0F15] hover:text-[#F5F7FA]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
