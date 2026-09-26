"use client";

import { Suspense, type FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [activationOnly, setActivationOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const confirmationStep = activationOnly || searchParams.get("activate") === "1";

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted && user) setActivationOnly(true);
    }).catch(() => {
      if (mounted) setError("Could not verify your sign-in session. Refresh the page and try again.");
    });
    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function activateAdmin(key: string) {
    const response = await fetch("/api/admin/activate", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    const result = await response.json() as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "Admin activation failed. Please try again.");
      return false;
    }

    router.push("/admin");
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (confirmationStep) {
        await activateAdmin(accessKey);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin/register?activate=1`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!data.session) {
        setMessage("Account created. Confirm your email using the link we sent; you will return here to activate admin access.");
        return;
      }

      setActivationOnly(true);
      await activateAdmin(accessKey);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!confirmationStep && (
        <div>
          <label htmlFor="admin-register-name" className="mb-2 block text-sm text-[#C7CBD4]">Display name</label>
          <div className="relative">
            <UserRound aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#737B89]" />
            <input
              id="admin-register-name"
              type="text"
              autoComplete="name"
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] py-3 pl-12 pr-4 text-[#F5F7FA] outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>
      )}

      {!confirmationStep && (
        <>
          <div>
            <label htmlFor="admin-register-email" className="mb-2 block text-sm text-[#C7CBD4]">Email</label>
            <div className="relative">
              <Mail aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#737B89]" />
              <input
                id="admin-register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] py-3 pl-12 pr-4 text-[#F5F7FA] outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-register-password" className="mb-2 block text-sm text-[#C7CBD4]">Password</label>
            <div className="relative">
              <Lock aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#737B89]" />
              <input
                id="admin-register-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] py-3 pl-12 pr-4 text-[#F5F7FA] outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="admin-register-key" className="mb-2 block text-sm text-[#C7CBD4]">Admin access key</label>
        <div className="relative">
          <KeyRound aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#737B89]" />
          <input
            id="admin-register-key"
            type="password"
            autoComplete="off"
            required
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
            className="w-full rounded-xl border border-[#252A35] bg-[#0D0F15] py-3 pl-12 pr-4 text-[#F5F7FA] outline-none focus:border-[#8B5CF6]"
          />
        </div>
        <p className="mt-2 text-xs text-[#737B89]">The key is sent to the server for verification and is never stored in your account.</p>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {message && <p role="status" aria-live="polite" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] px-4 py-3 font-semibold text-white transition hover:bg-[#7c4ae9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ShieldCheck aria-hidden="true" className="size-5" />
        {loading ? "Please wait..." : confirmationStep ? "Activate Admin" : "Create Admin Account"}
      </button>
    </form>
  );
}

export function AdminRegistrationForm() {
  return (
    <Suspense fallback={<p role="status" className="text-center text-sm text-[#9AA1AE]">Loading registration...</p>}>
      <RegistrationForm />
    </Suspense>
  );
}
