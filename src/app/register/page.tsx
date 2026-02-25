"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) return setError(t.register.errorName);

    const initialBalance = balance === "" ? 0 : Number(balance);
    if (isNaN(initialBalance) || initialBalance < 0) {
      return setError(t.register.errorBalance);
    }

    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, initialBalance }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error ?? "Something went wrong.");

    // Auto-login after successful registration
    login({ id: data.id, name: data.name });
    router.push("/trade");
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-amber-400">
          {t.register.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.register.subtitle}</p>
      </div>

      <div className="card p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">
              {t.register.nameLbl} <span className="text-amber-500">*</span>
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="e.g. Alice"
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Balance */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">
              {t.register.balanceLbl}
              <span className="text-slate-500 font-normal ml-1 text-xs">
                {t.register.balanceOptional}
              </span>
            </label>
            <div className="relative">
              <input
                className="input-field pr-12"
                type="number"
                placeholder="0"
                min={0}
                step={1}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 text-sm font-bold pointer-events-none">
                AUC
              </span>
            </div>
            <p className="text-xs text-slate-600">{t.register.balanceHint}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? t.register.submittingBtn : t.register.submitBtn}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-600">
        {t.register.alreadyRegistered}{" "}
        <Link href="/login" className="text-amber-500 hover:underline">
          {t.register.goLogin}
        </Link>
      </p>
    </div>
  );
}
