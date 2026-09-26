"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Download, Heart, Menu, PencilLine, Settings, Sparkles, UserRound, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SignOutButton } from "@/components/SignOutButton";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import { COMMUNITY_INVITE_URL } from "@/lib/constants";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Assets", href: "/assets" },
  { label: "Categories", href: "/#categories" },
  { label: "About", href: "/#why-dragonunit" },
];

type NavProfile = {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string;
};

type ProfileEditValues = {
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
};

function ProfileMenu({ profile, onSaved }: { profile: NavProfile; onSaved: (values: ProfileEditValues) => void }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function closeEditor() {
    setEditOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Open ${profile.name}'s account menu`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#8B5CF6]/40 bg-[#1B1827] text-xs font-semibold text-[#E9D5FF] transition hover:border-[#A78BFA] hover:ring-2 hover:ring-[#8B5CF6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
      >
        <span className="relative grid size-full place-items-center">
          {initials || "DU"}
          {profile.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt=""
              fill
              sizes="40px"
              unoptimized
              className="object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-[#252A35] bg-[#10131A] shadow-2xl shadow-black/40"
        >
          <div className="border-b border-[#252A35] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#F5F7FA]">{profile.name}</p>
            <p className="mt-1 truncate text-xs text-[#9AA1AE]">{profile.email}</p>
          </div>
          <nav aria-label="Account navigation" className="p-2">
            <button type="button" onClick={() => { setOpen(false); setEditOpen(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#D6D9E0] transition hover:bg-[#1A1D27] hover:text-white">
              <PencilLine className="size-4 text-[#9AA1AE]" /> Edit profile
            </button>
            <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D6D9E0] transition hover:bg-[#1A1D27] hover:text-white">
              <UserRound className="size-4 text-[#9AA1AE]" /> Profile
            </Link>
            <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D6D9E0] transition hover:bg-[#1A1D27] hover:text-white">
              <Settings className="size-4 text-[#9AA1AE]" /> Password and security
            </Link>
            <div className="my-1 border-t border-[#252A35]" />
            <Link href="/dashboard/downloads" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D6D9E0] transition hover:bg-[#1A1D27] hover:text-white">
              <Download className="size-4 text-[#9AA1AE]" /> Downloads
            </Link>
            <Link href="/dashboard/wishlist" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D6D9E0] transition hover:bg-[#1A1D27] hover:text-white">
              <Heart className="size-4 text-[#9AA1AE]" /> Wishlist
            </Link>
          </nav>
          <div className="border-t border-[#252A35] p-2">
            <SignOutButton label="Sign Out" />
          </div>
        </div>
      )}
      <ProfileEditDialog
        open={editOpen}
        initialValues={{
          displayName: profile.name,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl ?? "",
          bannerUrl: profile.bannerUrl,
        }}
        onClose={closeEditor}
        onSaved={(values) => {
          onSaved(values);
          closeEditor();
        }}
      />
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<NavProfile | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user;
        if (!user) {
          setProfile(null);
          return;
        }

        const name =
          user.user_metadata?.display_name ??
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ??
          "Member";
        const avatarUrl =
          user.user_metadata?.avatar_url ??
          user.user_metadata?.picture ??
          null;

        setProfile({
          name,
          email: user.email ?? "",
          bio: user.user_metadata?.bio ?? "",
          avatarUrl,
          bannerUrl: user.user_metadata?.banner_url ?? "",
        });
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sectionIds = ["categories", "why-dragonunit"];
    const updateActiveSection = () => {
      const sectionAtNavigationLine = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null)
        .map((section) => ({ id: section.id, top: section.getBoundingClientRect().top, bottom: section.getBoundingClientRect().bottom }))
        .filter((section) => section.top <= 150 && section.bottom > 150)
        .sort((first, second) => second.top - first.top)[0];

      setActiveSection(sectionAtNavigationLine?.id ?? null);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-mobile-navigation]")) {
        setMobileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const isNavItemActive = (href: string) => {
    const [path, section] = href.split("#");
    if (pathname !== path) return false;
    return section ? activeSection === section : pathname === "/" ? activeSection === null : true;
  };

  return (
    <header data-mobile-navigation className="sticky top-0 z-50 border-b border-[#252A35]/80 bg-[#08090D]/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#252A35] bg-[#10131A] text-[#8B5CF6]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9AA1AE]">DragonUnit</div>
            <div className="text-sm font-semibold tracking-[0.2em] text-[#F5F7FA]">ASSETS</div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isNavItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-sm transition after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[#8B5CF6] after:transition-transform ${active ? "text-[#F5F7FA] after:scale-x-100" : "text-[#9AA1AE] after:scale-x-0 hover:text-[#F5F7FA] hover:after:scale-x-100"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {profile ? (
            <>
              <Link
                href="/dashboard"
                aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#8B5CF6]/15 active:translate-y-0 active:scale-95 ${
                  pathname.startsWith("/dashboard")
                    ? "border-[#8B5CF6]/60 bg-[#8B5CF6]/10 text-[#F5F7FA]"
                    : "border-[#252A35] bg-[#10131A] text-[#F5F7FA] hover:border-[#8B5CF6]/60"
                }`}
              >
                Dashboard
              </Link>
              <ProfileMenu profile={profile} onSaved={(values) => setProfile((current) => current ? {
                ...current,
                name: values.displayName,
                bio: values.bio,
                avatarUrl: values.avatarUrl,
                bannerUrl: values.bannerUrl,
              } : current)} />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[#9AA1AE] transition hover:text-[#F5F7FA]">
                Login
              </Link>
              <a href={COMMUNITY_INVITE_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7c4ae9]">
                Join DragonUnit
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="inline-flex rounded-lg border border-[#252A35] bg-[#10131A] p-2 text-[#F5F7FA] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[#252A35] bg-[#0D0F15] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
            {navItems.map((item) => {
              const active = isNavItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-l-2 py-1 pl-3 text-sm transition ${active ? "border-[#8B5CF6] text-[#F5F7FA]" : "border-transparent text-[#9AA1AE] hover:text-[#F5F7FA]"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            {profile ? (
              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/dashboard"
                  aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 rounded-full border px-4 py-2 text-center text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#8B5CF6]/15 active:translate-y-0 active:scale-95 ${
                    pathname.startsWith("/dashboard")
                      ? "border-[#8B5CF6]/60 bg-[#8B5CF6]/10 text-[#F5F7FA]"
                      : "border-[#252A35] bg-[#10131A] text-[#F5F7FA] hover:border-[#8B5CF6]/60"
                  }`}
                >
                  Dashboard
                </Link>
                <ProfileMenu profile={profile} onSaved={(values) => setProfile((current) => current ? {
                  ...current,
                  name: values.displayName,
                  bio: values.bio,
                  avatarUrl: values.avatarUrl,
                  bannerUrl: values.bannerUrl,
                } : current)} />
              </div>
            ) : (
              <>
                <Link href="/login" className="rounded-full border border-[#252A35] bg-[#10131A] px-4 py-2 text-center text-sm font-medium text-[#F5F7FA]" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <a href={COMMUNITY_INVITE_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#8B5CF6] px-4 py-2 text-center text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>
                  Join DragonUnit
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
