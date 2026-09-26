import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "DragonUnit Assets — Premium Editing Assets",
    template: "%s | DragonUnit Assets",
  },
  description:
    "Premium anime clips, SFX, presets, project files, overlays and editing assets for creators.",
  openGraph: {
    title: "DragonUnit Assets — Premium Editing Assets",
    description:
      "Premium anime clips, SFX, presets, project files, overlays and editing assets for creators.",
    type: "website",
    siteName: "DragonUnit Assets",
  },
  twitter: {
    card: "summary_large_image",
    title: "DragonUnit Assets",
    description:
      "Premium anime clips, SFX, presets, project files, overlays and editing assets for creators.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#08090D] text-[#F5F7FA]">
        {children}
      </body>
    </html>
  );
}
