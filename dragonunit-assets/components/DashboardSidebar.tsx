"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const memberLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Browse Assets", href: "/assets" },
  { label: "Downloads", href: "/dashboard/downloads" },
  { label: "Wishlist", href: "/dashboard/wishlist" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Password and security", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-[#252A35] bg-[#10131A] p-4">
      <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">Member</p>
      <nav className="space-y-2">
        {memberLinks.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`block rounded-xl border px-3 py-2 text-sm transition ${isActive ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#F5F7FA]" : "border-transparent text-[#9AA1AE] hover:border-[#252A35] hover:bg-[#0D0F15] hover:text-[#F5F7FA]"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
