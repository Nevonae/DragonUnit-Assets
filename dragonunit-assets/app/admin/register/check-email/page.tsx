import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AdminRegistrationCheckEmailPage() {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-160px)] place-items-center px-4 py-14">
        <section className="w-full max-w-md rounded-3xl border border-[#252A35] bg-[#10131A] p-6 text-center shadow-2xl sm:p-8">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
            <MailCheck aria-hidden="true" className="size-8" />
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">DragonUnit Assets</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#F5F7FA]">Check your email</h1>
          <p className="mt-3 text-sm leading-6 text-[#9AA1AE]">
            Your account was created. Open the confirmation email from Supabase and follow its link. You’ll return here to enter your admin access key and finish activation.
          </p>
          <Link
            href="/admin/register"
            className="mt-7 inline-flex rounded-full border border-[#252A35] bg-[#0D0F15] px-5 py-2.5 text-sm font-medium text-[#F5F7FA] transition hover:border-[#8B5CF6]/60"
          >
            Return to admin registration
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
