"use client";

import { useEffect, useRef, useState } from "react";
import {
  SEHIRLER, PANEL_BIRIM_FIYATI, TURBINE_BIRIM_FIYATI, SISTEM_MALIYETI,
} from "@/libs/constants";
import type { SimulationInput, SimulationResult as SimResultType } from "@/libs/types";

// ── Mini icons for live preview ───────────────────────────────────
function MiniPanel() {
  return (
    <svg viewBox="0 0 16 13" width="16" height="13" style={{ display:"block" }}>
      <rect width="16" height="13" rx="1.5" fill="#1d4ed8"/>
      {[0,1].flatMap(r => [0,1,2].map(c => (
        <rect key={`${r}${c}`} x={1+c*5} y={1+r*5} width="4" height="4" rx="0.5" fill="#3b82f6" opacity="0.9"/>
      )))}
    </svg>
  );
}
function MiniTurbine() {
  return (
    <svg viewBox="0 0 12 22" width="10" height="18" style={{ display:"block" }}>
      <line x1="6" y1="22" x2="6" y2="10" stroke="#94a3b8" strokeWidth="1.5"/>
      <circle cx="6" cy="9" r="2" fill="#64748b"/>
      <line x1="6" y1="7" x2="6" y2="2"   stroke="#f1f5f9" strokeWidth="1.2"/>
      <line x1="6" y1="7" x2="1.5" y2="12" stroke="#e2e8f0" strokeWidth="1.2"/>
      <line x1="6" y1="7" x2="10.5" y2="12" stroke="#f1f5f9" strokeWidth="1.2"/>
    </svg>
  );
}

// ── Stepper ───────────────────────────────────────────────────────
function Stepper({
  label, value, onChange, min = 0, max = 999, hint,
  preview,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; hint?: string;
  preview?: React.ReactNode;
}) {
  function dec() { if (value > min) onChange(value - 1); }
  function inc() { if (value < max) onChange(value + 1); }
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-muted)" }}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={dec}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-150 active:scale-90 select-none"
          style={{ background:"var(--bg-muted)", color:"var(--primary)", border:"1.5px solid var(--border-strong)" }}>
          −
        </button>
        <div className="flex-1 text-center">
          <span className="text-4xl font-black tabular-nums" style={{ color:"var(--text-base)" }}>{value}</span>
        </div>
        <button type="button" onClick={inc}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-150 active:scale-90 select-none"
          style={{ background:"var(--primary)", color:"#fff", border:"1.5px solid var(--primary)" }}>
          +
        </button>
      </div>
      {hint && <p className="text-xs text-center" style={{ color:"#86efac" }}>{hint}</p>}
      {preview}
    </div>
  );
}

// ── City picker ────────────────────────────────────────────────────
function CityPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-muted)" }}>Şehir</label>
      <div className="flex flex-wrap gap-2">
        {SEHIRLER.map(s => {
          const active = s === value;
          return (
            <button key={s} type="button" onClick={() => onChange(s)}
              className="px-3 py-2 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95"
              style={{
                background: active ? "var(--primary)" : "var(--bg-muted)",
                color: active ? "#fff" : "var(--text-muted)",
                border: `1.5px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
                boxShadow: active ? "0 4px 12px rgba(22,163,74,0.3)" : "none",
              }}>
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Battery visual ─────────────────────────────────────────────────
function BatterySlider({
  value, onChange
}: { value: number; onChange: (v: number) => void }) {
  const pct = value;
  const color = pct > 60 ? "var(--primary)" : pct > 30 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-muted)" }}>
        Batarya Başlangıç
      </label>
      {/* Battery icon */}
      <div className="flex items-center gap-3">
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          <div style={{
            width:64, height:30, border:`2.5px solid ${color}`,
            borderRadius:6, position:"relative", overflow:"hidden",
            background:"var(--bg-muted)",
          }}>
            <div style={{
              position:"absolute", left:0, top:0, bottom:0,
              width:`${pct}%`,
              background:color,
              transition:"width 0.3s ease, background-color 0.3s ease",
              opacity:0.85,
            }}/>
            <div style={{
              position:"absolute", inset:0, display:"flex", alignItems:"center",
              justifyContent:"center", zIndex:1,
            }}>
              <span style={{ fontSize:10, fontWeight:800, color: pct > 40 ? "#fff" : color }}>
                {pct}%
              </span>
            </div>
          </div>
          {/* Terminal nub */}
          <div style={{ width:5, height:14, background:color, borderRadius:"0 3px 3px 0", transition:"background 0.3s" }}/>
        </div>
        <span className="text-sm font-semibold" style={{ color:"var(--text-muted)" }}>
          {(value / 10).toFixed(1)} kWh / 10 kWh
        </span>
      </div>
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
    </div>
  );
}

// ── Card section ──────────────────────────────────────────────────
function Section({ title, icon, children, delay = 0 }: {
  title: string; icon: string; children: React.ReactNode; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = window.setTimeout(
      () => requestAnimationFrame(() => el.classList.add("visible")),
      delay
    );
    return () => clearTimeout(id);
  }, [delay]);
  return (
    <div ref={ref} className="card anim-entry p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h2 className="section-label">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────
export default function SimulationForm({
  onResult,
}: { onResult: (r: SimResultType) => void }) {
  const [form, setForm] = useState<SimulationInput>({
    sehir: SEHIRLER[0],
    gun: 15,
    tuketim: 25,
    bataryaYuzde: 50,
    panelSayisi: 12,
    turbineSayisi: 2,
    satisYap: true,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const totalCost =
    Object.values(SISTEM_MALIYETI).reduce((a, b) => a + b, 0) +
    form.panelSayisi * PANEL_BIRIM_FIYATI +
    form.turbineSayisi * TURBINE_BIRIM_FIYATI;

  function set<K extends keyof SimulationInput>(key: K, val: SimulationInput[K]) {
    setForm(p => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const btn = btnRef.current;
    if (btn) {
      btn.style.transform = "scale(0.97)";
      requestAnimationFrame(() => requestAnimationFrame(() => { if (btn) btn.style.transform = ""; }));
    }
    try {
      const res  = await fetch("/api/simulate", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      onResult(data as SimResultType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  /* Panel preview icons */
  const panelIcons = (
    <div className="flex flex-wrap gap-1.5 pt-1 min-h-8">
      {Array(Math.min(form.panelSayisi, 16)).fill(null).map((_, i) => (
        <span key={i} style={{ animation: `mini-pop 0.25s ${i * 0.03}s both` }}>
          <MiniPanel/>
        </span>
      ))}
      {form.panelSayisi > 16 && (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full self-center"
          style={{ background:"var(--bg-muted)", color:"var(--primary)" }}>
          +{form.panelSayisi - 16}
        </span>
      )}
    </div>
  );

  /* Turbine preview icons */
  const turbineIcons = form.turbineSayisi > 0 ? (
    <div className="flex flex-wrap gap-2 pt-1 min-h-8">
      {Array(Math.min(form.turbineSayisi, 8)).fill(null).map((_, i) => (
        <span key={i} style={{ animation: `mini-pop 0.25s ${i * 0.06}s both` }}>
          <MiniTurbine/>
        </span>
      ))}
      {form.turbineSayisi > 8 && (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full self-center"
          style={{ background:"var(--bg-muted)", color:"var(--primary)" }}>
          +{form.turbineSayisi - 8}
        </span>
      )}
    </div>
  ) : (
    <p className="text-xs pt-1" style={{ color:"#86efac" }}>Türbin eklenmedi</p>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">

      {/* ── Konum & Tarih ── */}
      <Section title="Konum & Tarih" icon="📍" delay={80}>
        <CityPicker value={form.sehir} onChange={v => set("sehir", v)}/>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-muted)" }}>
            Mayıs Günü (1–31)
          </label>
          <input
            type="number" min={1} max={31}
            value={form.gun}
            onChange={e => set("gun", Math.max(1, Math.min(31, Number(e.target.value))))}
            className="field-input"
          />
        </div>
      </Section>

      {/* ── Tüketim & Batarya ── */}
      <Section title="Tüketim & Batarya" icon="⚡" delay={160}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-muted)" }}>
              Günlük Tüketim (kWh)
            </label>
            <input
              type="number" min={1} max={500}
              value={form.tuketim}
              onChange={e => set("tuketim", Math.max(1, Number(e.target.value)))}
              className="field-input"
            />
            <p className="text-xs" style={{ color:"#86efac" }}>Ortalama ev tüketimi 25-40 kWh/gün</p>
          </div>
          <BatterySlider value={form.bataryaYuzde} onChange={v => set("bataryaYuzde", v)}/>
        </div>
      </Section>

      {/* ── Sistem Konfigürasyonu ── */}
      <Section title="Sistem Konfigürasyonu" icon="🌿" delay={240}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Stepper
            label="Güneş Paneli Sayısı"
            value={form.panelSayisi}
            onChange={v => set("panelSayisi", v)}
            min={1}
            hint={`${PANEL_BIRIM_FIYATI.toLocaleString("tr-TR")} TL / panel`}
            preview={panelIcons}
          />
          <Stepper
            label="Rüzgar Türbini Sayısı"
            value={form.turbineSayisi}
            onChange={v => set("turbineSayisi", v)}
            min={0}
            hint={`${TURBINE_BIRIM_FIYATI.toLocaleString("tr-TR")} TL / türbin`}
            preview={turbineIcons}
          />
        </div>

        {/* Cost preview */}
        <div className="flex items-center justify-between rounded-2xl px-5 py-3.5"
             style={{ background:"var(--bg-muted)", border:"1.5px solid var(--border-strong)" }}>
          <span className="text-sm font-semibold" style={{ color:"var(--text-muted)" }}>
            Tahmini Sistem Maliyeti
          </span>
          <span className="text-lg font-black tabular-nums" style={{ color:"var(--primary)" }}>
            {totalCost.toLocaleString("tr-TR")} TL
          </span>
        </div>
      </Section>

      {/* ── Enerji Satışı ── */}
      <Section title="Enerji Satışı" icon="🔋" delay={320}>
        <label className="flex items-center gap-4 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={form.satisYap}
            onClick={() => set("satisYap", !form.satisYap)}
            className="relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2"
            style={{ background: form.satisYap ? "var(--primary)" : "var(--border-strong)" }}
          >
            <span
              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ transform: form.satisYap ? "translateX(28px)" : "translateX(0)" }}
            />
          </button>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text-base)" }}>
              Fazla enerjiyi şebekeye sat
            </p>
            <p className="text-xs" style={{ color:"#86efac" }}>1.10 TL / kWh</p>
          </div>
        </label>
      </Section>

      {/* Error */}
      {error && (
        <div className="rounded-2xl px-4 py-3 text-sm font-medium text-center"
             style={{ background:"#FEF2F2", color:"#DC2626", border:"1.5px solid #FECACA" }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        ref={btnRef}
        type="submit"
        disabled={loading}
        className="w-full py-5 rounded-2xl font-bold text-lg text-white cursor-pointer transition-all duration-200 disabled:opacity-60"
        style={{
          background: loading
            ? "var(--primary)"
            : "linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 50%, var(--accent) 100%)",
          boxShadow: "0 6px 24px rgba(22,163,74,0.35)",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Simüle Ediliyor…
          </span>
        ) : "Sistemi Çalıştır →"}
      </button>
    </form>
  );
}
