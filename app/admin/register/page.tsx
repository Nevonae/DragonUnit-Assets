import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminRegistrationForm } from "@/components/AdminRegistrationForm";

export default function AdminRegisterPage() {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-160px)] place-items-center px-4 py-14">
        <section className="w-full max-w-md rounded-3xl border border-[#252A35] bg-[#10131A] p-6 shadow-2xl sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
              <span aria-hidden="true" className="text-lg font-bold">DU</span>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#9AA1AE]">DragonUnit Assets</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#F5F7FA]">Admin registration</h1>
            <p className="mt-2 text-sm text-[#9AA1AE]">
              Create an account and verify the admin access key. Your profile is promoted by the server only after successful verification.
            </p>
          </div>

          <AdminRegistrationForm />

          <p className="mt-6 text-center text-sm text-[#9AA1AE]">
            Already registered?{" "}
            <Link href="/login?mode=admin" className="font-medium text-[#C4B5FD] hover:text-white">
              Sign in
            </Link>
          </p>
          <p className="mt-3 text-center">
            <Link href="/" className="text-sm text-[#737B89] hover:text-[#F5F7FA]">Back to DragonUnit Assets</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
