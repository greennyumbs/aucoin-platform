"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function Nav() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-amber-500/10 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none flex-shrink-0">
          <Image src="/bitkuy-icon-png.png" alt="Bitkuy" width={52} height={52} className="rounded-md" />
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-amber-400">
            Bitkuy
          </span>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-0.5 flex-1 justify-center">
          <NavLink href="/">{t.nav.leaderboard}</NavLink>
          <NavLink href="/trade">{t.nav.trade}</NavLink>
          <NavLink href="/history">{t.nav.history}</NavLink>
          <NavLink href="/about">{t.nav.about}</NavLink>
        </div>

        {/* Spacer on mobile */}
        <div className="flex-1 sm:hidden" />

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "en" ? "th" : "en")}
          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-amber-500/25 text-amber-500 hover:bg-amber-500/10 transition-colors w-10 text-center flex-shrink-0"
        >
          {lang === "en" ? "TH" : "EN"}
        </button>

        {/* Auth area */}
        {user ? (
          /* Logged in */
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* User name badge */}
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 max-w-[90px] sm:max-w-[130px]">
              <span className="text-xs text-amber-400 flex-shrink-0">👤</span>
              <span className="text-xs font-semibold text-amber-300 truncate">
                {user.name}
              </span>
            </div>
            {/* Logout */}
            <button
              onClick={logout}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5 flex-shrink-0"
              title={t.nav.logout}
            >
              <span className="hidden sm:inline">{t.nav.logout}</span>
              <span className="sm:hidden">✕</span>
            </button>
          </div>
        ) : (
          /* Logged out */
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Link
              href="/login"
              className="text-xs sm:text-sm text-amber-400 border border-amber-500/30 rounded-lg px-3 py-1.5 hover:bg-amber-500/10 transition-colors font-semibold"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="btn-gold text-xs sm:text-sm px-3 py-1.5 hidden sm:inline-block"
            >
              {t.nav.register}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-sm text-slate-400 hover:text-amber-400 rounded-md hover:bg-white/5 transition-colors"
    >
      {children}
    </Link>
  );
}
