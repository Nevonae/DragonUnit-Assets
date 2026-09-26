import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <DashboardSidebar />
          <div className="min-w-0 space-y-6">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}