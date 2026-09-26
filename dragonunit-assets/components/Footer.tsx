"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SignOutButton } from "@/components/SignOutButton";

export function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsLoggedIn(Boolean(session?.user)),
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <footer className="border-t border-[#252A35] bg-[#0D0F15]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9AA1AE]">DragonUnit</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#F5F7FA]">Assets</h3>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-[#9AA1AE]">
          <Link href="/assets">Assets</Link>
          <Link href="/#categories">Categories</Link>
          {isLoggedIn ? <SignOutButton label="Logout" /> : <Link href="/login">Login</Link>}
        </div>
      </div>
    </footer>
  );
}
