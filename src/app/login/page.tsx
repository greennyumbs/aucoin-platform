"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) return setError(t.login.errorEmpty);

    setLoading(true);
    const res = await fetch("/api/users");
    const users: { id: string; name: string }[] = await res.json();
    setLoading(false);

    const found = users.find(
      (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!found) return setError(t.login.errorNotFound);

    login({ id: found.id, name: found.name });
    router.push("/trade");
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="text-center space-y-1">
        <div className="text-4xl mb-2">🔑</div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-amber-400">
          {t.login.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.login.subtitle}</p>
      </div>

      <div className="card p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">
              {t.login.nameLbl} <span className="text-amber-500">*</span>
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

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? t.login.submittingBtn : t.login.submitBtn}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-600">
        {t.login.noAccount}{" "}
        <Link href="/register" className="text-amber-500 hover:underline">
          {t.login.register}
        </Link>
      </p>
    </div>
  );
}
