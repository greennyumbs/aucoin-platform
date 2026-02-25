"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-4">
      {/* Hero — AuCoin focus */}
      <div className="text-center space-y-3 py-6">
        <Image
          src="/aucoin-icon-png.png"
          alt="AuCoin"
          width={360}
          height={360}
          className="mx-auto rounded-full"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-400">
          AuCoin (AUC)
        </h1>
        <p className="text-slate-400 text-sm italic">{a.tagline}</p>
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-sm text-amber-400 font-semibold">
          1 AUC = 100 THB
        </div>
      </div>

      {/* Background */}
      <section className="card p-5 space-y-3">
        <h2 className="text-amber-300 font-bold text-base flex items-center gap-2">
          <span>📖</span> {a.backgroundTitle}
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          {a.backgroundStory}{" "}
          <span className="text-amber-400 font-semibold">
            {a.backgroundName}
          </span>{" "}
          {a.backgroundPlayed}
        </p>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm space-y-1">
          <p className="text-slate-400">{a.lossLabel}</p>
          <p className="text-red-400 font-bold text-lg">{a.lossAmount}</p>
        </div>
        <p className="text-slate-300 text-sm font-semibold">
          {a.backgroundConclusion}
        </p>
      </section>

      {/* AuCoin */}
      <section className="card p-5 space-y-3">
        <h2 className="text-amber-300 font-bold text-base flex items-center gap-2">
          <Image
            src="/aucoin-icon-png.png"
            alt="AUC"
            width={22}
            height={22}
            className="rounded-full"
          />
          {a.aucoinTitle}
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">{a.aucoinDesc}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-extrabold text-amber-400">210</div>
            <div className="text-xs text-slate-500 mt-0.5">{a.totalSupply}</div>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-extrabold text-amber-400">100</div>
            <div className="text-xs text-slate-500 mt-0.5">{a.thbPerAuc}</div>
          </div>
        </div>
        <p className="text-slate-500 text-xs">{a.aucoinNote}</p>
      </section>

      {/* How it works */}
      <section className="card p-5 space-y-3">
        <h2 className="text-amber-300 font-bold text-base flex items-center gap-2">
          <span>⚙️</span> {a.howTitle}
        </h2>
        <p className="text-slate-400 text-sm">{a.howIntro}</p>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-2.5">
            <span className="text-red-400 w-12 flex-shrink-0">{a.lose}</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-300">{a.loseAction}</span>
          </div>
          <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/10 rounded-lg px-4 py-2.5">
            <span className="text-green-400 w-12 flex-shrink-0">{a.win}</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-300">{a.winAction}</span>
          </div>
          <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-2.5">
            <span className="text-amber-400 w-12 flex-shrink-0">{a.cope}</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-300">{a.copeAction}</span>
          </div>
        </div>
        <p className="text-slate-500 text-xs">{a.howNote}</p>
      </section>

      {/* Tokenomics */}
      <section className="card p-5 space-y-3">
        <h2 className="text-amber-300 font-bold text-base flex items-center gap-2">
          <span>📊</span> {a.tokenomicsTitle}
        </h2>
        <div className="space-y-2 text-sm">
          {[
            [a.tSupply, a.tSupplyVal],
            [a.tMint, a.tMintVal],
            [a.tBurn, a.tBurnVal],
            [a.tHalving, a.tHalvingVal],
            [a.tScarcity, a.tScarcityVal],
          ].map(([key, val]) => (
            <div key={key} className="flex items-start gap-2">
              <span className="text-slate-500 w-28 flex-shrink-0">{key}</span>
              <span className="text-slate-300">{val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="card p-5 space-y-3">
        <h2 className="text-amber-300 font-bold text-base flex items-center gap-2">
          <span>🔐</span> {a.securityTitle}
        </h2>
        <p className="text-slate-300 text-sm">{a.securityDesc}</p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-center">
          <span className="text-amber-400 font-bold text-base">
            {a.securityAlgo}
          </span>
        </div>
        <p className="text-slate-400 text-sm">{a.securityRefuse}</p>
        <ul className="space-y-1 text-sm text-slate-400">
          {[a.sec1, a.sec2, a.sec3].map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="text-red-400">•</span> {s}
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="card p-5 space-y-3">
        <h2 className="text-amber-300 font-bold text-base flex items-center gap-2">
          <span>⚠️</span> {a.disclaimerTitle}
        </h2>
        <p className="text-slate-400 text-sm">{a.disclaimerIntro}</p>
        <ul className="space-y-1 text-sm text-slate-500">
          {[a.d1, a.d2, a.d3, a.d4].map((d) => (
            <li key={d} className="flex items-center gap-2">
              <span className="text-amber-600">×</span> {d}
            </li>
          ))}
        </ul>
        <p className="text-slate-400 text-sm">
          {a.disclaimerNote}{" "}
          <span className="text-amber-400 italic">{a.disclaimerExcept}</span>
        </p>
      </section>

      {/* Final Words */}
      <section className="card p-5 space-y-3 text-center">
        <p className="text-slate-400 text-sm leading-relaxed">
          {a.closingLine1}
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          {a.closingLine2}
        </p>
        <blockquote className="text-amber-400 font-bold text-lg italic">
          {a.closingQuote}
        </blockquote>
        <p className="text-slate-500 text-sm">{a.closingPostscript}</p>
        <p className="text-slate-600 text-xs mt-4">{a.author}</p>
      </section>
    </div>
  );
}
