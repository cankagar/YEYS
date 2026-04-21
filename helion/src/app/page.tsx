"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SimulationForm from "@/components/SimulationForm";
import NatureCanvas   from "@/components/NatureCanvas";
import EnergyScene    from "@/components/EnergyScene";
import Image from "next/image";
import type { SimulationResult } from "@/libs/types";

export default function Home() {
  const [result,    setResult]    = useState<SimulationResult | null>(null);
  const [showScene, setShowScene] = useState(false);

  function handleResult(r: SimulationResult) {
    setResult(r);
    setShowScene(true);
  }

  function handleBack() {
    setShowScene(false);
  }

  const springTrans = { type: "spring" as const, stiffness: 300, damping: 32 };

  return (
    <div style={{ position:"relative", overflow:"hidden", height:"100dvh" }}>

      {/* ── Page 1: Form (slides left) ── */}
      <motion.div
        animate={{ x: showScene ? "-100%" : 0 }}
        transition={springTrans}
        style={{
          position:"absolute", inset:0,
          overflowY:"auto", overflowX:"hidden",
          background:"var(--bg)",
        }}
      >
        <NatureCanvas/>

        <div className="relative" style={{ zIndex:1 }}>

          {/* Header */}
          <header
            className="sticky top-0"
            style={{
              background:"rgba(240,253,244,0.85)",
              backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
              borderBottom:"1.5px solid var(--border)", zIndex:50,
            }}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-2xl overflow-hidden flex-shrink-0"
                style={{
                  width: 52, height: 52,
                  background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                  boxShadow: "0 4px 18px rgba(14,165,233,0.25), 0 1px 4px rgba(0,0,0,0.15)",
                  padding: 4,
                }}
              >
                <Image
                  src="/logo.png"
                  alt="YEYS Logo"
                  width={44}
                  height={44}
                  unoptimized
                  style={{ width: 44, height: 44, objectFit: "contain" }}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-base font-bold leading-none tracking-wide" style={{ color:"var(--text-base)" }}>YEYS</h1>
                <p className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>Yenilenebilir Enerji Yönetim Sistemi</p>
              </div>
              <span
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background:"var(--bg-muted)", border:"1.5px solid var(--border-strong)", color:"var(--primary)" }}
              >
                🌱 Doğa Dostu
              </span>
            </div>
          </header>

          {/* Hero */}
          <div
            className="w-full py-10 px-4 text-center"
            style={{ background:"linear-gradient(180deg, rgba(220,252,231,0.6) 0%, transparent 100%)" }}
          >
            <p className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color:"var(--text-base)" }}>
              Enerji Simülasyonu
            </p>
            <p className="mt-2 text-sm sm:text-base" style={{ color:"var(--text-muted)" }}>
              Güneş &amp; rüzgar üretiminizi simüle edin, tasarrufunuzu keşfedin.
            </p>
          </div>

          {/* Form */}
          <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
            <SimulationForm onResult={handleResult}/>
          </main>

          <footer
            className="text-center py-6 text-xs"
            style={{ color:"#86efac", borderTop:"1px solid var(--border)" }}
          >
            YEYS — Yenilenebilir Enerji Yönetim Sistemi · Mayıs Simülasyonu
          </footer>
        </div>
      </motion.div>

      {/* ── Page 2: Energy Scene (slides in from right) ── */}
      <motion.div
        initial={{ x:"100%" }}
        animate={{ x: showScene ? 0 : "100%" }}
        transition={springTrans}
        style={{ position:"absolute", inset:0, zIndex:10 }}
      >
        {result && (
          <EnergyScene
            result={result}
            panelSayisi={result.panelSayisi}
            turbineSayisi={result.turbineSayisi}
            onBack={handleBack}
          />
        )}
      </motion.div>
    </div>
  );
}
