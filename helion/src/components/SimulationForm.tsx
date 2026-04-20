"use client";

import { useState } from "react";
import { SEHIRLER, PANEL_BIRIM_FIYATI, TURBINE_BIRIM_FIYATI, SISTEM_MALIYETI } from "@/lib/constants";
import type { SimulationInput, SimulationResult as SimulationResultType } from "@/lib/types";
import SimulationResultPanel from "./SimulationResult";

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
  const [result, setResult] = useState<SimulationResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tahminiMaliyet =
    Object.values(SISTEM_MALIYETI).reduce((a, b) => a + b, 0) +
    form.panelSayisi * PANEL_BIRIM_FIYATI +
    form.turbineSayisi * TURBINE_BIRIM_FIYATI;

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setResult(data as SimulationResultType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  function set<K extends keyof SimulationInput>(key: K, value: SimulationInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Konum & Tarih */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
            Konum &amp; Tarih
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Şehir</label>
              <select
                value={form.sehir}
                onChange={(e) => set("sehir", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SEHIRLER.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Mayıs Günü (1–31)
              </label>
              <input
                type="number" min={1} max={31}
                value={form.gun}
                onChange={(e) => set("gun", Math.max(1, Math.min(31, Number(e.target.value))))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Tüketim & Batarya */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
            Tüketim &amp; Batarya
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Günlük Tüketim (kWh)
              </label>
              <input
                type="number" min={0.1} step={0.1}
                value={form.tuketim}
                onChange={(e) => set("tuketim", Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Batarya Başlangıç Doluluk (%)
              </label>
              <div className="space-y-2">
                <input
                  type="range" min={0} max={100}
                  value={form.bataryaYuzde}
                  onChange={(e) => set("bataryaYuzde", Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{form.bataryaYuzde}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sistem Konfigürasyonu */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
            Sistem Konfigürasyonu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Güneş Paneli Sayısı
              </label>
              <input
                type="number" min={1}
                value={form.panelSayisi}
                onChange={(e) => set("panelSayisi", Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="mt-1 text-xs text-zinc-400">{PANEL_BIRIM_FIYATI.toLocaleString("tr-TR")} TL/panel</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Rüzgar Türbini Sayısı
              </label>
              <input
                type="number" min={0}
                value={form.turbineSayisi}
                onChange={(e) => set("turbineSayisi", Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="mt-1 text-xs text-zinc-400">{TURBINE_BIRIM_FIYATI.toLocaleString("tr-TR")} TL/türbin</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-300">
            Tahmini Toplam Sistem Maliyeti:{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {tahminiMaliyet.toLocaleString("tr-TR")} TL
            </span>
          </div>
        </section>

        {/* Enerji Satışı */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
            Enerji Satışı
          </h2>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => set("satisYap", !form.satisYap)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.satisYap ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  form.satisYap ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Fazla enerjiyi şebekeye sat (1.10 TL/kWh)
            </span>
          </label>
        </section>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-base transition-colors"
        >
          {loading ? "Simüle Ediliyor..." : "Simülasyonu Başlat"}
        </button>
      </form>

      {result && <SimulationResultPanel result={result} />}
    </div>
  );
}
