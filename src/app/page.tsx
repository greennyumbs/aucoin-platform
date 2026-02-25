"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
    const id = setInterval(fetchUsers, 10_000);
    return () => clearInterval(id);
  }, []);

  const sorted = [...users].sort((a, b) => b.balance - a.balance);
  const total = users.reduce((s, u) => s + u.balance, 0);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="text-center space-y-1.5 py-3">
        <Image
          src="/bitkuy-icon-png.png"
          alt="Bitkuy"
          width={180}
          height={180}
          className="mx-auto rounded-2xl"
        />
        <p className="text-slate-400 text-xs sm:text-sm">{t.home.tagline}</p>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 text-sm text-amber-400 font-semibold">
            <Image src="/aucoin-icon-png.png" alt="AUC" width={80} height={80} className="rounded-full" />
            <span className="ml-[-12px]">{t.home.exchangeRate}</span>
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard label={t.home.participants} value={String(users.length)} />
        <StatCard label={t.home.circulation} value={total.toLocaleString()} />
        <StatCard label={t.home.transactions} value="→" href="/history" />
      </div>

      {/* Leaderboard */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-amber-300 text-sm sm:text-base">
            {t.home.leaderboard}
          </h2>
          <button
            onClick={fetchUsers}
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors"
          >
            {t.home.refresh}
          </button>
        </div>

        {loading ? (
          <p className="text-slate-500 text-sm text-center py-6">{t.home.loading}</p>
        ) : users.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-slate-500 text-sm">{t.home.noParticipants}</p>
            <Link href="/register" className="btn-gold text-sm">
              {t.home.beFirst}
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {sorted.map((user, i) => (
              <LeaderboardRow key={user.id} user={user} rank={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 justify-center flex-wrap pb-2">
        <Link href="/register" className="btn-gold text-sm">
          {t.home.registerBtn}
        </Link>
        <Link
          href="/trade"
          className="text-sm border border-amber-500/30 text-amber-400 rounded-lg px-5 py-2.5 hover:bg-amber-500/10 transition-colors font-semibold"
        >
          {t.home.sendBtn}
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <div className="card p-3 sm:p-4 text-center hover:border-amber-500/30 transition-colors">
      <div className="text-lg sm:text-xl font-extrabold text-amber-400 truncate">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5 leading-tight line-clamp-2">{label}</div>
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

function LeaderboardRow({ user, rank }: { user: User; rank: number }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-lg hover:bg-white/4 transition-colors">
      <span className="w-6 sm:w-7 text-center text-sm font-bold text-slate-500 flex-shrink-0">
        {medal ?? `#${rank}`}
      </span>
      <span className="flex-1 font-medium text-slate-200 text-sm sm:text-base truncate">
        {user.name}
      </span>
      <span className="font-bold text-amber-400 tabular-nums text-sm sm:text-base flex-shrink-0 flex items-center gap-1.5">
        {user.balance.toLocaleString()}
        <Image src="/aucoin-icon-png.png" alt="AUC" width={64} height={64} className="rounded-full" />
        <span className="text-xs text-amber-600">AUC</span>
      </span>
    </div>
  );
}
