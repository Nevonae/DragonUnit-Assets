"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SecuritySettingsForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (newPassword.length < 8) {
      setStatus("Use at least 8 characters for your password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setStatus("Password updated.");
  }

  return (
    <section className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6">
      <div className="border-b border-[#252A35] pb-5">
        <h2 className="text-lg font-semibold text-[#F5F7FA]">Password and security</h2>
      </div>
      <form onSubmit={updatePassword} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-[#D6D9E0]">
          New password
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
            className="mt-2 block h-11 w-full rounded-lg border border-[#252A35] bg-[#0D0F15] px-3 text-sm text-[#F5F7FA] outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
          />
        </label>
        <label className="text-sm font-medium text-[#D6D9E0]">
          Confirm new password
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            required
            className="mt-2 block h-11 w-full rounded-lg border border-[#252A35] bg-[#0D0F15] px-3 text-sm text-[#F5F7FA] outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
          />
        </label>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p role="status" className="text-sm text-[#B8A4FF]">{status}</p>
          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-lg border border-[#252A35] px-5 text-sm font-medium text-[#F5F7FA] transition hover:border-[#8B5CF6]/60 hover:bg-[#0D0F15] disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </section>
  );
}