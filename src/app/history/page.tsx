"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Transaction } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export default function HistoryPage() {
  const { t } = useLanguage();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTxs() {
    const res = await fetch("/api/transactions");
    if (res.ok) setTxs(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchTxs();
    const id = setInterval(fetchTxs, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-amber-400">
            {t.history.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {t.history.txCount(txs.length)}
          </p>
        </div>
        <button
          onClick={fetchTxs}
          className="text-xs text-slate-500 hover:text-amber-400 transition-colors border border-white/10 rounded-lg px-3 py-1.5 flex-shrink-0"
        >
          {t.history.refresh}
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-slate-500 text-sm text-center py-10">{t.history.loading}</p>
        ) : txs.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-4xl">📭</p>
            <p className="text-slate-500 text-sm">{t.history.empty}</p>
            <a href="/trade" className="btn-gold text-sm mt-2">
              {t.history.makeTrade}
            </a>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {txs.map((tx) => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TxRow({ tx }: { tx: Transaction }) {
  const date = new Date(tx.timestamp);
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <div className="px-4 sm:px-5 py-3.5 flex items-start gap-3 hover:bg-white/3 transition-colors">
      <div className="mt-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-sm">
        ↗
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200">
          <span className="font-semibold text-white">{tx.fromName}</span>
          <span className="text-slate-500 mx-1">→</span>
          <span className="font-semibold text-white">{tx.toName}</span>
        </p>
        {tx.note && (
          <p className="text-xs text-slate-500 mt-0.5 truncate italic">
            &ldquo;{tx.note}&rdquo;
          </p>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-bold text-amber-400 tabular-nums text-sm flex items-center gap-1 justify-end">
          +{tx.amount.toLocaleString()}
          <Image
            src="/aucoin-icon-png.png"
            alt="AUC"
            width={60}
            height={60}
            className="rounded-full"
          />
          <span className="text-xs text-amber-600">AUC</span>
        </p>
        <p className="text-xs text-slate-600 mt-0.5">
          {dateStr} · {timeStr}
        </p>
      </div>
    </div>
  );
}
