"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileSettingsForm({
  initialDisplayName,
  email,
}: {
  initialDisplayName: string;
  email: string;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [nameStatus, setNameStatus] = useState("");
  const [savingName, setSavingName] = useState(false);

  async function saveDisplayName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = displayName.trim();
    if (!nextName) {
      setNameStatus("Enter a display name.");
      return;
    }

    setSavingName(true);
    setNameStatus("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { display_name: nextName },
    });
    setSavingName(false);

    if (error) {
      setNameStatus(error.message);
      return;
    }

    setDisplayName(nextName);
    setNameStatus("Display name updated.");
  }

  return (
    <section className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6">
        <div className="border-b border-[#252A35] pb-5">
          <h2 className="text-lg font-semibold text-[#F5F7FA]">Profile information</h2>
          <p className="mt-1 text-sm text-[#9AA1AE]">{email || "Email unavailable"}</p>
        </div>
        <form onSubmit={saveDisplayName} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 text-sm font-medium text-[#D6D9E0]">
            Display name
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={80}
              required
              className="mt-2 block h-11 w-full rounded-lg border border-[#252A35] bg-[#0D0F15] px-3 text-sm text-[#F5F7FA] outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </label>
          <button
            type="submit"
            disabled={savingName}
            className="h-11 rounded-lg bg-[#8B5CF6] px-5 text-sm font-semibold text-white transition hover:bg-[#7C4AE9] disabled:cursor-wait disabled:opacity-60"
          >
            {savingName ? "Saving..." : "Save changes"}
          </button>
        </form>
        {nameStatus && <p role="status" className="mt-3 text-sm text-[#B8A4FF]">{nameStatus}</p>}
      </section>
  );
}