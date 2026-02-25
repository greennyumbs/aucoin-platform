import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bitkuy",
  description: "AuCoin trading platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${sarabun.className}`}>
        <Providers>
          <Nav />
          {/* pb-24 gives clearance for the mobile bottom nav; sm:pb-8 resets on desktop */}
          <main className="max-w-4xl mx-auto px-4 py-6 pb-28 sm:pb-8">
            {children}
          </main>
          <footer className="hidden sm:block text-center text-xs text-slate-600 pb-6 mt-2">
            Bitkuy · AuCoin (AUC)
          </footer>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
