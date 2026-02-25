"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Transaction } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

function AucIcon() {
  return (
    <Image
      src="/aucoin-icon-png.png"
      alt="AUC"
      width={60}
      height={60}
      className="rounded-full inline-block"
    />
  );
}

export default function TradePage() {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState<Transaction | null>(null);

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }, []);

  const sender = users.find((u) => u.id === authUser?.id);
  const recipient = users.find((u) => u.id === toId);
  const amountNum = Number(amount);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLastTx(null);

    if (!toId) return setError(t.trade.errorSelectTo);
    if (!amount || amountNum <= 0) return setError(t.trade.errorAmount);

    setLoading(true);
    const res = await fetch("/api/trade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromId: authUser!.id, toId, amount: amountNum, note }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error ?? "Trade failed.");

    setLastTx(data);
    setAmount("");
    setNote("");
    setToId("");
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!authUser) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-16">
        <div className="text-5xl">🔒</div>
        <p className="text-slate-300 font-semibold">{t.trade.loginRequired}</p>
        <Link href="/login" className="btn-gold text-sm">
          {t.trade.loginBtn}
        </Link>
      </div>
    );
  }

  // ── Logged in ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-amber-400">{t.trade.title}</h1>
        <p className="text-slate-400 text-sm">{t.trade.subtitle}</p>
      </div>

      {/* Success banner */}
      {lastTx && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm space-y-1">
          <p className="text-green-400 font-semibold">{t.trade.successTitle}</p>
          <p className="text-slate-400 flex items-center gap-1 flex-wrap">
            <span className="text-white">{lastTx.fromName}</span>
            <span>→</span>
            <span className="text-white">{lastTx.toName}</span>
            <span>·</span>
            <span className="text-amber-400 font-bold inline-flex items-center gap-1">
              {lastTx.amount.toLocaleString()} <AucIcon /> AUC
            </span>
          </p>
          {lastTx.note && (
            <p className="text-slate-500 italic">&ldquo;{lastTx.note}&rdquo;</p>
          )}
        </div>
      )}

      <div className="card p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Sender — locked to logged-in user */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">{t.trade.fromLbl}</label>
            <div className="input-field flex items-center justify-between cursor-default select-none opacity-80">
              <span className="flex items-center gap-2">
                <span className="text-amber-400">👤</span>
                <span className="font-semibold text-white">{authUser.name}</span>
                <span className="text-xs text-slate-500">{t.trade.sendingAs}</span>
              </span>
              {sender && (
                <span className="text-amber-400 font-bold text-sm tabular-nums flex-shrink-0 flex items-center gap-1">
                  {sender.balance.toLocaleString()} <AucIcon /> AUC
                </span>
              )}
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">{t.trade.toLbl}</label>
            <select
              className="input-field"
              value={toId}
              onChange={(e) => setToId(e.target.value)}
            >
              <option value="">{t.trade.toPlaceholder}</option>
              {users
                .filter((u) => u.id !== authUser.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.balance.toLocaleString()} AUC)
                  </option>
                ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">{t.trade.amountLbl}</label>
            <div className="relative">
              <input
                className="input-field pr-16"
                type="number"
                placeholder="0"
                min={1}
                step={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <AucIcon />
                <span className="text-amber-600 text-sm font-bold">AUC</span>
              </span>
            </div>
            {sender && (
              <p className="text-xs text-slate-500">
                <span className="text-amber-400 font-semibold">
                  {sender.balance.toLocaleString()} AUC
                </span>{" "}
                {t.trade.available}
              </p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">
              {t.trade.noteLbl}{" "}
              <span className="text-slate-600 font-normal text-xs">{t.trade.noteOptional}</span>
            </label>
            <input
              className="input-field"
              type="text"
              placeholder={t.trade.notePlaceholder}
              maxLength={100}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Preview */}
          {sender && recipient && amountNum > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3 text-sm space-y-1">
              <p className="text-slate-400 text-xs">{t.trade.preview}</p>
              <p className="text-slate-200">
                <span className="font-semibold text-white">{sender.name}</span>
                <span className="text-slate-500"> {t.trade.previewWillSend} </span>
                <span className="font-bold text-amber-400">{amountNum.toLocaleString()} AUC</span>
                <span className="text-slate-500"> {t.trade.previewTo} </span>
                <span className="font-semibold text-white">{recipient.name}</span>
              </p>
              <p className="text-slate-500 text-xs">
                {t.trade.previewAfter} {sender.name} →{" "}
                {Math.max(0, sender.balance - amountNum).toLocaleString()} AUC
                &nbsp;|&nbsp;
                {recipient.name} → {(recipient.balance + amountNum).toLocaleString()} AUC
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? t.trade.sendingBtn : t.trade.sendBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
