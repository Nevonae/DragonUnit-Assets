"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

export function AdminPromotionForm() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function activateAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/admin/activate", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const result = await response.json() as { error?: string; success?: boolean };

      if (!response.ok) {
        setIsError(true);
        setMessage(result.error ?? "Admin activation failed.");
        return;
      }

      setKey("");
      setMessage("Admin role activated. Opening the admin dashboard...");
      router.replace("/admin");
      router.refresh();
    } catch {
      setIsError(true);
      setMessage("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#B79CFF]">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#F5F7FA]">Activate Admin</h2>
          <p className="mt-1 text-sm text-[#9AA1AE]">Enter the site admin key to promote this signed-in account.</p>
        </div>
      </div>
      <form onSubmit={activateAdmin} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Admin access key</span>
          <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#737B89]" />
          <input
            type="password"
            autoComplete="off"
            required
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="Admin access key"
            className="h-11 w-full rounded-lg border border-[#303342] bg-[#0D0F15] pl-10 pr-3 text-sm text-[#F5F7FA] outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !key}
          className="h-11 shrink-0 rounded-lg bg-[#8B5CF6] px-5 text-sm font-semibold text-white transition hover:bg-[#7C4AE9] disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Activate Admin"}
        </button>
      </form>
      {message && <p role={isError ? "alert" : "status"} className={`mt-3 text-sm ${isError ? "text-red-300" : "text-emerald-300"}`}>{message}</p>}
    </section>
  );
}