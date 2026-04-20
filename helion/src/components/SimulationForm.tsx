"use client";

import { useEffect, useRef, useState } from "react";
import {
  SEHIRLER, PANEL_BIRIM_FIYATI, TURBINE_BIRIM_FIYATI, SISTEM_MALIYETI,
} from "@/lib/constants";
import type { SimulationInput, SimulationResult as SimResultType } from "@/lib/types";
import SimulationResultPanel from "./SimulationResult";

// ── Entry animation hook ──────────────────────────────────────────
function useEntryAnim(deps: unknown[] = []) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("visible");
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add("visible"));
    });
    return () => cancelAnimationFrame(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// ── Input wrapper ─────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>{label}</label>
      {children}
      {hint && <p className="text-xs" style={{ color: "#86efac" }}>{hint}</p>}
    </div>
  );
}

// ── Card section ──────────────────────────────────────────────────
function FormSection({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = window.setTimeout(() => {
      requestAnimationFrame(() => el.classList.add("visible"));
    }, delay);
    return () => clearTimeout(id);
  }, [delay]);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="card anim-entry p-6 space-y-4">
      <h2 className="section-label">{title}</h2>
      {children}
    </section>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: checked ? "var(--primary)" : "var(--border-strong)",
          boxShadow: checked ? "0 0 0 0 rgba(22,163,74,0)" : undefined,
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ transform: checked ? "translateX(24px)" : "translateX(0)" }}
        />
      </button>
      <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
    </label>
  );
}

// ── Main Form ─────────────────────────────────────────────────────
export default function SimulationForm() {
  const [form, setForm] = useState<SimulationInput>({
    sehir: SEHIRLER[0],
    gun: 15,
    tuketim: 25,
    bataryaYuzde: 50,
    panelSayisi: 12,
    turbineSayisi: 2,
    satisYap: true,
  });
  const [result, setResult]   = useState<SimResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const tahminiMaliyet =
    Object.values(SISTEM_MALIYETI).reduce((a, b) => a + b, 0) +
    form.panelSayisi * PANEL_BIRIM_FIYATI +
    form.turbineSayisi * TURBINE_BIRIM_FIYATI;

  function set<K extends keyof SimulationInput>(key: K, val: SimulationInput[K]) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Button press animation via rAF
    const btn = btnRef.current;
    if (btn) {
      btn.style.transform = "scale(0.97)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { if (btn) btn.style.transform = ""; });
      });
    }

    try {
      const res  = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setResult(data as SimResultType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Konum & Tarih */}
        <FormSection title="📍 Konum &amp; Tarih" delay={80}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Şehir">
              <select
                value={form.sehir}
                onChange={(e) => set("sehir", e.target.value)}
                className="field-input cursor-pointer"
              >
                {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Mayıs Günü (1–31)">
              <input
                type="number" min={1} max={31}
                value={form.gun}
                onChange={(e) => set("gun", Math.max(1, Math.min(31, Number(e.target.value))))}
                className="field-input"
              />
            </Field>
          </div>
        </FormSection>

        {/* Tüketim & Batarya */}
        <FormSection title="⚡ Tüketim &amp; Batarya" delay={160}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Günlük Tüketim (kWh)">
              <input
                type="number"
                value={form.tuketim}
                onChange={(e) => set("tuketim", Number(e.target.value))}
                className="field-input"
              />
            </Field>
            <Field label={`Batarya Başlangıç Doluluk — %${form.bataryaYuzde}`}>
              <input
                type="range" min={0} max={100}
                value={form.bataryaYuzde}
                onChange={(e) => set("bataryaYuzde", Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
                style={{ accentColor: "var(--primary)" }}
              />
              <div className="w-full h-2 rounded-full overflow-hidden mt-1"
                   style={{ background: "var(--bg-muted)" }}>
                <div
                  className="battery-fill"
                  style={{ width: `${form.bataryaYuzde}%` }}
                />
              </div>
            </Field>
          </div>
        </FormSection>

        {/* Sistem */}
        <FormSection title="🌿 Sistem Konfigürasyonu" delay={240}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Güneş Paneli Sayısı"
              hint={`${PANEL_BIRIM_FIYATI.toLocaleString("tr-TR")} TL / panel`}
            >
              <input
                type="number" min={1}
                value={form.panelSayisi}
                onChange={(e) => set("panelSayisi", Math.max(1, Number(e.target.value)))}
                className="field-input"
              />
            </Field>
            <Field
              label="Rüzgar Türbini Sayısı"
              hint={`${TURBINE_BIRIM_FIYATI.toLocaleString("tr-TR")} TL / türbin`}
            >
              <input
                type="number" min={0}
                value={form.turbineSayisi}
                onChange={(e) => set("turbineSayisi", Math.max(0, Number(e.target.value)))}
                className="field-input"
              />
            </Field>
          </div>

          {/* Cost preview */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}
          >
            <span>Tahmini Toplam Sistem Maliyeti</span>
            <span className="font-bold text-base" style={{ color: "var(--primary)" }}>
              {tahminiMaliyet.toLocaleString("tr-TR")} TL
            </span>
          </div>
        </FormSection>

        {/* Satış */}
        <FormSection title="🔋 Enerji Satışı" delay={320}>
          <Toggle
            checked={form.satisYap}
            onChange={() => set("satisYap", !form.satisYap)}
            label="Fazla enerjiyi şebekeye sat (1.10 TL / kWh)"
          />
        </FormSection>

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm font-medium text-center"
            style={{ background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA" }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          ref={btnRef}
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-base text-white cursor-pointer transition-all duration-200 disabled:opacity-60"
          style={{
            background: loading
              ? "var(--primary)"
              : "linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 50%, var(--accent) 100%)",
            boxShadow: "var(--shadow-md)",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Simüle Ediliyor…
            </span>
          ) : "🌱  Simülasyonu Başlat"}
        </button>
      </form>

      {result && <SimulationResultPanel result={result} />}
    </div>
  );
}
