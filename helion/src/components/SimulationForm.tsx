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

// ── Packages ──────────────────────────────────────────────────────
const PAKETLER = [
  {
    id: "basic" as const,
    name: "Helion Basic",
    badge: "Giriş Seviyesi",
    panels: 8,
    turbines: 0,
    desc: "8 güneş paneli",
  },
  {
    id: "pro" as const,
    name: "Helion Pro",
    badge: "İleri Seviye — Enterprise",
    panels: 10,
    turbines: 1,
    desc: "10 güneş paneli + 1 rüzgar türbini",
  },
] as const;

type PaketId = typeof PAKETLER[number]["id"];

function PackagePicker({
  value, onChange,
}: { value: PaketId; onChange: (id: PaketId, panels: number, turbines: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Sistem Paketi
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAKETLER.map(p => {
          const active = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id, p.panels, p.turbines)}
              className="flex flex-col gap-2 rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.98]"
              style={{
                background: active ? "var(--primary)" : "var(--bg-muted)",
                border: `1.5px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
                boxShadow: active ? "0 4px 16px rgba(22,163,74,0.3)" : "none",
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: active ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}>
                {p.badge}
              </span>
              <span className="text-base font-black" style={{ color: active ? "#fff" : "var(--text-base)" }}>
                {p.name}
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array(p.panels).fill(null).map((_, i) => (
                  <span key={i}><MiniPanel /></span>
                ))}
                {p.turbines > 0 && Array(p.turbines).fill(null).map((_, i) => (
                  <span key={`t${i}`}><MiniTurbine /></span>
                ))}
              </div>
              <span className="text-xs font-medium mt-1" style={{ color: active ? "rgba(255,255,255,0.85)" : "#86efac" }}>
                {p.desc}
              </span>
            </button>
          );
        })}
      </div>
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
        className="w-full h-3 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: color,
          background: `linear-gradient(to right, ${color} ${value}%, var(--border-strong) ${value}%)`,
        }}
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
  const [paket, setPaket] = useState<PaketId>("basic");
  const [tuketimStr, setTuketimStr] = useState("25");
  const [form, setForm] = useState<SimulationInput>({
    sehir: SEHIRLER[0],
    gun: 15,
    tuketim: 25,
    bataryaYuzde: 50,
    panelSayisi: PAKETLER[0].panels,
    turbineSayisi: PAKETLER[0].turbines,
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
              value={tuketimStr}
              onChange={e => {
                setTuketimStr(e.target.value);
                const n = Number(e.target.value);
                if (e.target.value !== "" && n >= 1) set("tuketim", n);
              }}
              onBlur={() => {
                const n = Number(tuketimStr);
                const clamped = (!tuketimStr || n < 1) ? 1 : n;
                setTuketimStr(String(clamped));
                set("tuketim", clamped);
              }}
              className="field-input"
            />
            <p className="text-xs" style={{ color:"#86efac" }}>Ortalama ev tüketimi 25-40 kWh/gün</p>
          </div>
          <BatterySlider value={form.bataryaYuzde} onChange={v => set("bataryaYuzde", v)}/>
        </div>
      </Section>

      {/* ── Sistem Konfigürasyonu ── */}
      <Section title="Sistem Konfigürasyonu" icon="🌿" delay={240}>
        <PackagePicker
          value={paket}
          onChange={(id, panels, turbines) => {
            setPaket(id);
            setForm(p => ({ ...p, panelSayisi: panels, turbineSayisi: turbines }));
          }}
        />
        <p className="text-xs font-medium px-1" style={{ color: "var(--text-muted)" }}>
          💡 {form.tuketim > 20
            ? "Tüketiminiz yüksek (>20 kWh) — Helion Pro (Enterprise) paketi önerilir."
            : "Tüketiminiz düşük (≤20 kWh) — Helion Basic paketi yeterli olabilir."}
        </p>

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
