"use client";

import { useEffect, useRef, useState } from "react";
import type { SimulationResult } from "@/lib/types";
import {
  BATARYA_KAPASITESI, GRID_FIYATI, SATIS_FIYATI,
  SISTEM_OMRU, PANEL_BIRIM_FIYATI, TURBINE_BIRIM_FIYATI,
} from "@/lib/constants";

// ── rAF count-up hook ─────────────────────────────────────────────
function useCountUp(target: number, duration = 900, decimals = 2) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      setVal(parseFloat((target * eased).toFixed(decimals)));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals]);

  return val;
}

// ── Animated battery bar ──────────────────────────────────────────
function BatteryBar({ pct }: { pct: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setWidth(pct * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [pct]);

  return (
    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, #4ade80, var(--primary), var(--accent))",
          transition: "none",
        }}
      />
    </div>
  );
}

// ── Animated number display ────────────────────────────────────────
function AnimNum({ value, suffix = "", prefix = "", dec = 2 }: {
  value: number; suffix?: string; prefix?: string; dec?: number;
}) {
  const animated = useCountUp(value, 900, dec);
  return <>{prefix}{animated.toLocaleString("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</>;
}

// ── Entry animation ────────────────────────────────────────────────
function useEntryOnMount(delay = 0) {
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
  return ref;
}

// ── Sub-components ────────────────────────────────────────────────
function ResultSection({
  title, children, delay = 0,
}: { title: string; children: React.ReactNode; delay?: number }) {
  const ref = useEntryOnMount(delay);
  return (
    <div ref={ref} className="card anim-entry p-5 space-y-4">
      <h3 className="section-label">{title}</h3>
      {children}
    </div>
  );
}

function StatCard({
  label, value, sub, highlight = false,
}: { label: string; value: React.ReactNode; sub?: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-2xl p-4 space-y-1"
      style={{
        background: highlight ? "var(--bg-muted)" : "var(--bg)",
        border: `1.5px solid ${highlight ? "var(--border-strong)" : "var(--border)"}`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6ee7b7" }}>{label}</p>
      <p className="text-lg font-bold leading-tight" style={{ color: "var(--text-base)" }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: "#6ee7b7" }}>{sub}</p>}
    </div>
  );
}

const SENARYO_CONFIG: Record<number, { label: string; bg: string; border: string; color: string }> = {
  1: { label: "Senaryo 1 — Fazla Üretim",  bg: "#F0FDF4", border: "#86EFAC", color: "#15803D" },
  2: { label: "Senaryo 2 — Grid Devreye",   bg: "#FFFBEB", border: "#FCD34D", color: "#92400E" },
  3: { label: "Senaryo 3 — BLACKOUT",       bg: "#FEF2F2", border: "#FCA5A5", color: "#991B1B" },
  4: { label: "Senaryo 4 — Batarya Şarj",   bg: "#F0FDF4", border: "#86EFAC", color: "#15803D" },
  5: { label: "Senaryo 5 — Kesintide BLACKOUT", bg: "#FEF2F2", border: "#FCA5A5", color: "#991B1B" },
};

const SENARYO_METNI: Record<number, (s: boolean) => string> = {
  1: (s) => `Üretim tüketimi karşıladı. Batarya doldu. Fazla enerji ${s ? "şebekeye satıldı" : "toprağa verildi"}.`,
  2: () => "Üretim yetersiz. Batarya kullanıldı, bitti. Açık şebekeden sağlandı.",
  3: () => "Üretim yetersiz. Batarya bitti. Şebeke karşılayamadı. BLACKOUT oluştu.",
  4: () => "Üretim tüketimi karşıladı. Kalan enerji bataryaya verildi.",
  5: () => "Üretim yetersiz. Grid devreye girdi. Kesinti sırasında BLACKOUT oluştu.",
};

// ── Main Result ───────────────────────────────────────────────────
export default function SimulationResult({ result }: { result: SimulationResult }) {
  const headerRef = useEntryOnMount(0);
  const denge      = result.toplamUretim - result.tuketim;
  const batDegisim = result.bataryaSon - result.bataryaBas;
  const sonYuzde   = (result.bataryaSon / BATARYA_KAPASITESI) * 100;
  const basYuzde   = (result.bataryaBas / BATARYA_KAPASITESI) * 100;

  const senaryo = SENARYO_CONFIG[result.senaryoNo] ?? SENARYO_CONFIG[4];

  return (
    <div className="space-y-5 mt-2">
      {/* Header */}
      <div ref={headerRef} className="anim-entry flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: "var(--text-base)" }}>
          Simülasyon Sonucu
        </h2>
        <span className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ background: "var(--bg-muted)", color: "var(--primary)" }}>
          {result.sehir} — {result.gun} Mayıs
        </span>
      </div>

      {/* Overheat */}
      {result.overheatPanelSayisi > 0 && (
        <div className="rounded-2xl px-4 py-3 text-sm font-medium"
             style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", color: "#92400E" }}>
          ⚠️ <strong>OVER HEAT:</strong> {result.overheatPanelSayisi}/{result.panelSayisi} panel aşırı ısındı — GES üretimi düştü.
        </div>
      )}

      {/* Senaryo banner */}
      <div
        className="anim-entry visible rounded-2xl px-4 py-3 text-sm font-semibold"
        style={{ background: senaryo.bg, border: `1.5px solid ${senaryo.border}`, color: senaryo.color }}
      >
        <span className="font-bold">{senaryo.label}:</span>{" "}
        {SENARYO_METNI[result.senaryoNo]?.(result.satisYap)}
      </div>

      {/* Üretim */}
      <ResultSection title="☀️ Üretim Bilgileri" delay={60}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="GES (Güneş)"
            value={<AnimNum value={result.ges} suffix=" kWh" />}
            sub={`${result.panelSayisi} panel`}
          />
          <StatCard
            label="RES (Rüzgar)"
            value={<AnimNum value={result.res} suffix=" kWh" />}
            sub={`${result.turbineSayisi} türbin`}
          />
          <StatCard
            label="Toplam Üretim"
            value={<AnimNum value={result.toplamUretim} suffix=" kWh" />}
            highlight
          />
          <StatCard
            label="Enerji Dengesi"
            value={
              <span style={{ color: denge >= 0 ? "var(--primary)" : "var(--danger)" }}>
                {denge >= 0 ? "+" : ""}<AnimNum value={Math.abs(denge)} suffix=" kWh" />
              </span>
            }
            sub={denge >= 0 ? "fazla" : "açık"}
          />
        </div>
      </ResultSection>

      {/* Batarya */}
      <ResultSection title="🔋 Batarya Durumu" delay={120}>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Başlangıç"
            value={<AnimNum value={result.bataryaBas} suffix=" kWh" />}
            sub={`%${basYuzde.toFixed(1)}`}
          />
          <StatCard
            label="Bitiş"
            value={<AnimNum value={result.bataryaSon} suffix=" kWh" />}
            sub={`%${sonYuzde.toFixed(1)}`}
            highlight
          />
          <StatCard
            label="Değişim"
            value={
              <span style={{ color: batDegisim >= 0 ? "var(--primary)" : "var(--warning)" }}>
                {batDegisim >= 0 ? "+" : ""}<AnimNum value={Math.abs(batDegisim)} suffix=" kWh" />
              </span>
            }
            sub={batDegisim >= 0 ? "şarj" : "deşarj"}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs" style={{ color: "#6ee7b7" }}>
            <span>Bitiş Batarya Seviyesi</span>
            <span>%{sonYuzde.toFixed(1)}</span>
          </div>
          <BatteryBar pct={sonYuzde} />
        </div>
      </ResultSection>

      {/* Enerji Akışı */}
      <ResultSection title="⚡ Enerji Akışı" delay={180}>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Şebekeden Çekilen"
            value={<AnimNum value={result.gridKullanim} suffix=" kWh" />}
            sub={`${(result.gridKullanim * GRID_FIYATI).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL maliyet`}
          />
          {result.satisYap ? (
            <StatCard
              label="Şebekeye Satılan"
              value={<AnimNum value={result.fazlaEnerji} suffix=" kWh" />}
              sub={`+${(result.fazlaEnerji * SATIS_FIYATI).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL gelir`}
              highlight
            />
          ) : (
            <StatCard label="Toprağa Atılan" value={<AnimNum value={result.fazlaEnerji} suffix=" kWh" />} />
          )}
        </div>
      </ResultSection>

      {/* Kesinti */}
      <ResultSection title="🚨 Kesinti Simülasyonu" delay={240}>
        {result.kesintiSuresi === 0 ? (
          <p className="text-sm" style={{ color: "var(--primary)" }}>
            ✅ Bugün elektrik kesintisi yaşanmadı.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Kesinti Süresi"  value={`${result.kesintiSuresi} saat`} />
              <StatCard label="YEYS Koruması"   value={`${result.kurtarilanSaat.toFixed(1)} saat`} highlight />
              <StatCard
                label="Blackout"
                value={<span style={{ color: result.blackoutSaat > 0 ? "var(--danger)" : "var(--primary)" }}>
                  {result.blackoutSaat.toFixed(1)} saat
                </span>}
              />
            </div>
            {result.blackoutSaat > 0 && (
              <div className="rounded-xl px-4 py-3 text-sm font-medium"
                   style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#991B1B" }}>
                Batarya tükendi — {result.blackoutSaat.toFixed(1)} saatlik BLACKOUT yaşandı.
              </div>
            )}
          </>
        )}
      </ResultSection>

      {/* Maliyet */}
      <ResultSection title="💰 Maliyet Analizi" delay={300}>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="YEYS Olmadan"
            value={<AnimNum value={result.faturaSystemsiz} suffix=" TL" />}
            sub="fatura/gün"
          />
          <StatCard
            label="YEYS İle"
            value={<AnimNum value={result.faturaSystemli} suffix=" TL" />}
            sub="fatura/gün"
          />
          <StatCard
            label="Net Kazanç"
            value={
              <span style={{ color: result.gunlukKazanc >= 0 ? "var(--primary)" : "var(--danger)" }}>
                {result.gunlukKazanc >= 0 ? "+" : ""}<AnimNum value={Math.abs(result.gunlukKazanc)} suffix=" TL" />
              </span>
            }
            sub="günlük"
            highlight
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "var(--bg-muted)" }}>
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}></th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}>YEYS Olmadan</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}>YEYS İle</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--primary)" }}>Kazanç</th>
              </tr>
            </thead>
            <tbody style={{ background: "var(--bg-card)" }}>
              {[
                { label: "Günlük",
                  yok: result.faturaSystemsiz, yeys: result.faturaSystemli, net: result.gunlukKazanc },
                { label: "Aylık",
                  yok: result.aylikFaturaYok, yeys: result.aylikFaturaYeys, net: result.aylikKazanc },
              ].map((row) => (
                <tr key={row.label} style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>{row.label}</td>
                  <td className="px-4 py-3 text-right" style={{ color: "var(--text-base)" }}>
                    {row.yok.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                  </td>
                  <td className="px-4 py-3 text-right" style={{ color: "var(--text-base)" }}>
                    {row.yeys.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                  </td>
                  <td className="px-4 py-3 text-right font-bold"
                      style={{ color: row.net >= 0 ? "var(--primary)" : "var(--danger)" }}>
                    {row.net >= 0 ? "+" : ""}{row.net.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.satisYap && result.satisGeliri > 0 && (
          <p className="text-xs" style={{ color: "#6ee7b7" }}>
            * Günlük kazanca {result.satisGeliri.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL satış geliri dahildir.
          </p>
        )}
      </ResultSection>

      {/* Yatırım */}
      <ResultSection title="📈 Yatırım Analizi" delay={360}>
        <div className="space-y-2 text-sm">
          {/* Maliyet kalemleri */}
          <div className="rounded-2xl p-4 space-y-2" style={{ background: "var(--bg-muted)" }}>
            <div className="flex justify-between font-bold" style={{ color: "var(--text-base)" }}>
              <span>Toplam Kurulum Maliyeti</span>
              <AnimNum value={result.toplamMaliyet} suffix=" TL" dec={0} />
            </div>
            {Object.entries(result.sistemMaliyetiKalemler).map(([k, v]) => (
              <div key={k} className="flex justify-between pl-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>— {k}</span>
                <span>{v.toLocaleString("tr-TR")} TL</span>
              </div>
            ))}
            <div className="flex justify-between pl-4 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>— güneş paneli ({result.panelSayisi} × {PANEL_BIRIM_FIYATI.toLocaleString("tr-TR")} TL)</span>
              <span>{(result.panelSayisi * PANEL_BIRIM_FIYATI).toLocaleString("tr-TR")} TL</span>
            </div>
            {result.turbineSayisi > 0 && (
              <div className="flex justify-between pl-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>— rüzgar türbini ({result.turbineSayisi} × {TURBINE_BIRIM_FIYATI.toLocaleString("tr-TR")} TL)</span>
                <span>{(result.turbineSayisi * TURBINE_BIRIM_FIYATI).toLocaleString("tr-TR")} TL</span>
              </div>
            )}
          </div>

          <div className="flex justify-between py-2" style={{ borderTop: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-muted)" }}>Tahmini Yıllık Kazanç</span>
            <strong style={{ color: "var(--primary)" }}>
              <AnimNum value={result.yillikKazanc} suffix=" TL" />
            </strong>
          </div>

          {result.amortismanYil !== null ? (
            <>
              <div className="flex justify-between py-2" style={{ borderTop: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)" }}>Amortisman Süresi</span>
                <strong style={{ color: "var(--text-base)" }}>{result.amortismanYil.toFixed(1)} yıl</strong>
              </div>
              <div className="flex justify-between py-2" style={{ borderTop: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)" }}>Sistem Ömrü</span>
                <strong style={{ color: "var(--text-base)" }}>{SISTEM_OMRU} yıl</strong>
              </div>
              <div
                className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{
                  background: result.omurBoyuKazanc >= 0 ? "var(--bg-muted)" : "#FEF2F2",
                  border: `1.5px solid ${result.omurBoyuKazanc >= 0 ? "var(--border-strong)" : "#FECACA"}`,
                }}
              >
                <span className="font-semibold" style={{ color: "var(--text-base)" }}>Ömür Boyu Net Kazanç</span>
                <strong className="text-lg"
                        style={{ color: result.omurBoyuKazanc >= 0 ? "var(--primary)" : "var(--danger)" }}>
                  {result.omurBoyuKazanc >= 0 ? "+" : ""}
                  <AnimNum value={Math.abs(result.omurBoyuKazanc)} suffix=" TL" dec={0} />
                </strong>
              </div>
            </>
          ) : (
            <p className="text-xs py-2" style={{ color: "#6ee7b7" }}>
              Amortisman hesaplanamadı (yıllık kazanç yok).
            </p>
          )}
        </div>
      </ResultSection>
    </div>
  );
}
