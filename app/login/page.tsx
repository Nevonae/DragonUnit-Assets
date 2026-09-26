"use client";

import { Suspense, type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Globe,
  MessageSquareText,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdminMode = searchParams.get("mode") === "admin";
  const supabase = createClient();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessKey, setAdminAccessKey] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAdminMode) void fetch("/api/admin/revoke-key", { method: "POST" });
  }, [isAdminMode]);

  function switchMode(adminMode: boolean) {
    router.replace(adminMode ? "/login?mode=admin" : "/login", { scroll: false });
    setIsRegister(false);
    setError("");
    setSuccess("");
    if (!adminMode) void fetch("/api/admin/revoke-key", { method: "POST" });
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
            emailRedirectTo:
              `${window.location.origin}/auth/callback?next=/`,
          },
        });

        if (error) {
          setError(error.message);
          return;
        }

        if (data.session) {
          router.push("/");
          return;
        }

        setSuccess(
          "Registration successful. Check your email to confirm your account."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        if (isAdminMode) {
          const response = await fetch("/api/admin/activate", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: adminAccessKey }),
          });
          const result = await response.json() as { error?: string };

          if (!response.ok) {
            setError(result.error ?? "Admin access could not be verified.");
            return;
          }

          router.push("/admin");
          return;
        }

        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuthSignIn(
    provider: "google" | "discord"
  ) {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to start social login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-160px)] px-4 py-16">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-white/10 bg-[#10131A] p-6 shadow-2xl sm:p-8">

            <div role="group" aria-label="Sign-in type" className="mb-7 grid grid-cols-2 rounded-xl border border-white/10 bg-[#0D0F15] p-1">
              <button
                type="button"
                aria-pressed={!isAdminMode}
                onClick={() => switchMode(false)}
                className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition ${!isAdminMode ? "bg-[#252833] text-white" : "text-gray-400 hover:text-white"}`}
              >
                <LogIn className="size-4" /> Member
              </button>
              <button
                type="button"
                aria-pressed={isAdminMode}
                onClick={() => switchMode(true)}
                className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition ${isAdminMode ? "bg-[#252833] text-white" : "text-gray-400 hover:text-white"}`}
              >
                <ShieldCheck className="size-4" /> Admin
              </button>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
                {isAdminMode ? (
                  <ShieldCheck className="h-7 w-7 text-purple-400" />
                ) : isRegister ? (
                  <UserPlus className="h-7 w-7 text-purple-400" />
                ) : (
                  <LogIn className="h-7 w-7 text-purple-400" />
                )}
              </div>

              <h1 className="text-2xl font-bold text-white">
                {isAdminMode ? "Admin sign in" : isRegister ? "Create your account" : "Welcome back"}
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                {isAdminMode
                  ? "Sign in with your account and enter the access key to activate admin access."
                  : isRegister
                  ? "Join DragonUnit Assets and start exploring."
                  : "Sign in to access DragonUnit Assets."}
              </p>
            </div>

            {/* OAuth buttons */}
            {!isAdminMode && <div className="space-y-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleOAuthSignIn("google")}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#161922] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1c202a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Globe className="h-5 w-5" />
                Continue with Google
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleOAuthSignIn("discord")}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#161922] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1c202a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageSquareText className="h-5 w-5" />
                Continue with Discord
              </button>
            </div>}

            {/* Divider */}
            {!isAdminMode && <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>}

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">

              {isRegister && !isAdminMode && (
                <div>
                  <label htmlFor="display-name" className="mb-2 block text-sm text-gray-300">
                    Display name
                  </label>

                  <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0D0F15] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0D0F15] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500"
                  />
                </div>
              </div>

              {isAdminMode && (
                <div>
                  <label className="mb-2 block text-sm text-gray-300" htmlFor="admin-access-key">
                    Admin access key
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    <input
                      id="admin-access-key"
                      type="password"
                      value={adminAccessKey}
                      onChange={(event) => setAdminAccessKey(event.target.value)}
                      autoComplete="off"
                      required
                      className="w-full rounded-xl border border-white/10 bg-[#0D0F15] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="mb-2 block text-sm text-gray-300">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-white/10 bg-[#0D0F15] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div role="status" aria-live="polite" className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : isRegister
                    ? "Create Account"
                    : isAdminMode ? "Activate Admin" : "Login"}
              </button>
            </form>

            {/* Switch login/register */}
            {!isAdminMode && <div className="mt-6 text-center text-sm text-gray-400">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="font-medium text-purple-400 hover:text-purple-300"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setError("");
                      setSuccess("");
                    }}
                    className="font-medium text-purple-400 hover:text-purple-300"
                  >
                    Register
                  </button>
                </>
              )}
            </div>}

            {isAdminMode && (
              <p className="mt-6 text-center text-sm text-gray-400">
                Need an admin account?{" "}
                <Link href="/admin/register" className="font-medium text-purple-400 hover:text-purple-300">
                  Register here
                </Link>
              </p>
            )}

            {/* Back to home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 transition hover:text-gray-300"
              >
                ← Back to DragonUnit Assets
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-[calc(100vh-160px)] place-items-center px-4">
          <p role="status" className="text-sm text-gray-400">Loading sign-in...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}