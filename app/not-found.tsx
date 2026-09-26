import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.28em] text-[#9AA1AE]">404</p>
      <h1 className="text-4xl font-semibold text-[#F5F7FA]">Page not found</h1>
      <p className="max-w-xl text-[#9AA1AE]">
        The page you requested is unavailable or has moved.
      </p>
      <Link
        href="/"
        className="rounded-full border border-[#252A35] bg-[#10131A] px-6 py-3 text-sm font-medium text-[#F5F7FA] transition hover:border-[#8B5CF6] hover:text-white"
      >
        Return home
      </Link>
    </main>
  );
}
