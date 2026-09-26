import Link from "next/link";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Assets", href: "/admin#assets" },
  { label: "Upload Asset", href: "/admin/upload" },
  { label: "Members", href: "/admin/members" },
  { label: "Downloads", href: "/admin#downloads" },
  { label: "Settings", href: "/admin#settings" },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-2xl border border-[#252A35] bg-[#10131A] p-4 md:w-72">
      <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">Admin</p>
      <nav className="space-y-2">
        {adminLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-xl border border-transparent px-3 py-2 text-sm text-[#9AA1AE] transition hover:border-[#252A35] hover:bg-[#0D0F15] hover:text-[#F5F7FA]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
