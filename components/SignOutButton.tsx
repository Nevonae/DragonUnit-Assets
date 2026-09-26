"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ label = "Sign out" }: { label?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSignOut() {
    setError("");
    const supabase = createClient();
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError("Could not sign out. Please try again.");
      return;
    }

    await fetch("/api/admin/revoke-key", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg border border-[#252A35] px-4 py-2 text-sm font-medium text-[#F5F7FA] transition hover:bg-[#0D0F15]"
      >
        {label}
      </button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}