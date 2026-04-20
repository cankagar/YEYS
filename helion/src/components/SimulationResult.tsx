"use client";

import type { SimulationResult } from "@/lib/types";
import { BATARYA_KAPASITESI, GRID_FIYATI, SATIS_FIYATI, SISTEM_OMRU, PANEL_BIRIM_FIYATI, TURBINE_BIRIM_FIYATI } from "@/lib/constants";

const SENARYO_METNI: Record<number, (satisYap: boolean) => string> = {
  1: (s) => `Üretim tüketimi karşıladı. Batarya doldu. Fazla enerji ${s ? "şebekeye satıldı" : "toprağa verildi"}.`,
  2: () => "Üretim yetersiz kaldı. Batarya kullanıldı, bitti. Açık şebekeden sağlandı.",
  3: () => "Üretim yetersiz. Batarya bitti. Şebeke karşılayamadı. BLACKOUT oluştu.",
  4: () => "Üretim tüketimi karşıladı. Kalan enerji bataryaya verildi.",
  5: () => "Üretim yetersiz. Grid devreye girdi. Kesinti sırasında BLACKOUT oluştu.",
};

const SENARYO_RENK: Record<number, string> = {
  1: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300",
  2: "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300",
  3: "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300",
  4: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300",
  5: "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300",
};

function fmt(n: number, dec = 2) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function SimulationResult({ result }: { result: SimulationResult }) {
  const denge = result.toplamUretim - result.tuketim;
  const bataryaDegisim = result.bataryaSon - result.bataryaBas;
  const basYuzde = (result.bataryaBas / BATARYA_KAPASITESI) * 100;
  const sonYuzde = (result.bataryaSon / BATARYA_KAPASITESI) * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Simülasyon Sonucu
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {result.sehir} — {result.gun} Mayıs
        </span>
      </div>

      {/* Overheat uyarısı */}
      {result.overheatPanelSayisi > 0 && (
        <div className="rounded-xl border border-orange-400 bg-orange-50 dark:bg-orange-950/30 p-4 text-orange-800 dark:text-orange-300 text-sm">
          ⚠️ <strong>OVER HEAT:</strong> {result.overheatPanelSayisi}/{result.panelSayisi} güneş paneli aşırı ısındı, GES üretimi düştü.
        </div>
      )}

      {/* Senaryo */}
      <div className={`rounded-xl border-2 p-4 text-sm font-medium ${SENARYO_RENK[result.senaryoNo]}`}>
        <span className="font-bold">Senaryo {result.senaryoNo}:</span>{" "}
        {SENARYO_METNI[result.senaryoNo]?.(result.satisYap)}
      </div>

      {/* Üretim */}
      <Section title="Üretim Bilgileri">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="GES (Güneş)" value={`${fmt(result.ges)} kWh`} sub={`${result.panelSayisi} panel`} />
          <StatCard label="RES (Rüzgar)" value={`${fmt(result.res)} kWh`} sub={`${result.turbineSayisi} türbin`} />
          <StatCard label="Toplam Üretim" value={`${fmt(result.toplamUretim)} kWh`} />
          <StatCard
            label="Enerji Dengesi"
            value={`${denge >= 0 ? "+" : ""}${fmt(denge)} kWh`}
            sub={denge >= 0 ? "fazla" : "açık"}
          />
        </div>
      </Section>

      {/* Batarya */}
      <Section title="Batarya Durumu">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard label="Başlangıç" value={`${fmt(result.bataryaBas)} kWh`} sub={`%${fmt(basYuzde, 1)}`} />
          <StatCard label="Bitiş" value={`${fmt(result.bataryaSon)} kWh`} sub={`%${fmt(sonYuzde, 1)}`} />
          <StatCard
            label="Değişim"
            value={`${bataryaDegisim >= 0 ? "+" : ""}${fmt(bataryaDegisim)} kWh`}
            sub={bataryaDegisim >= 0 ? "şarj" : "deşarj"}
          />
        </div>
        {/* Batarya bar */}
        <div>
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Batarya Seviyesi</span>
            <span>%{fmt(sonYuzde, 1)}</span>
          </div>
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, sonYuzde)}%` }}
            />
          </div>
        </div>
      </Section>

      {/* Enerji Akışı */}
      <Section title="Enerji Akışı">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Şebekeden Çekilen"
            value={`${fmt(result.gridKullanim)} kWh`}
            sub={`${fmt(result.gridKullanim * GRID_FIYATI)} TL`}
          />
          {result.satisYap ? (
            <StatCard
              label="Şebekeye Satılan"
              value={`${fmt(result.fazlaEnerji)} kWh`}
              sub={`+${fmt(result.fazlaEnerji * SATIS_FIYATI)} TL gelir`}
            />
          ) : (
            <StatCard label="Toprağa Atılan" value={`${fmt(result.fazlaEnerji)} kWh`} />
          )}
        </div>
      </Section>

      {/* Kesinti */}
      <Section title="Kesinti Simülasyonu">
        {result.kesintiSuresi === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Bugün elektrik kesintisi yaşanmadı.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Kesinti Süresi" value={`${result.kesintiSuresi} saat`} />
              <StatCard label="YEYS Koruması" value={`${fmt(result.kurtarilanSaat, 1)} saat`} />
              <StatCard
                label="Blackout"
                value={`${fmt(result.blackoutSaat, 1)} saat`}
              />
            </div>
            {result.blackoutSaat > 0 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-700 p-3 text-sm text-red-700 dark:text-red-300">
                Batarya tükendi: {fmt(result.blackoutSaat, 1)} saatlik BLACKOUT yaşandı.
              </div>
            )}
          </>
        )}
      </Section>

      {/* Maliyet */}
      <Section title="Maliyet Analizi">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="YEYS Olmadan" value={`${fmt(result.faturaSystemsiz)} TL/gün`} />
          <StatCard label="YEYS İle" value={`${fmt(result.faturaSystemli)} TL/gün`} />
          <StatCard
            label="Net Kazanç"
            value={`${result.gunlukKazanc >= 0 ? "+" : ""}${fmt(result.gunlukKazanc)} TL/gün`}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-400 uppercase">
                <th className="text-left py-2 pr-4"></th>
                <th className="text-right py-2 pr-4">YEYS Olmadan</th>
                <th className="text-right py-2 pr-4">YEYS İle</th>
                <th className="text-right py-2">Net Kazanç</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-300">Günlük</td>
                <td className="py-2 pr-4 text-right text-zinc-900 dark:text-zinc-100">{fmt(result.faturaSystemsiz)} TL</td>
                <td className="py-2 pr-4 text-right text-zinc-900 dark:text-zinc-100">{fmt(result.faturaSystemli)} TL</td>
                <td className="py-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                  {result.gunlukKazanc >= 0 ? "+" : ""}{fmt(result.gunlukKazanc)} TL
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-300">Aylık</td>
                <td className="py-2 pr-4 text-right text-zinc-900 dark:text-zinc-100">{fmt(result.aylikFaturaYok)} TL</td>
                <td className="py-2 pr-4 text-right text-zinc-900 dark:text-zinc-100">{fmt(result.aylikFaturaYeys)} TL</td>
                <td className="py-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                  {result.aylikKazanc >= 0 ? "+" : ""}{fmt(result.aylikKazanc)} TL
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {result.satisYap && result.satisGeliri > 0 && (
          <p className="text-xs text-zinc-400">* Günlük kazanca {fmt(result.satisGeliri)} TL satış geliri dahildir.</p>
        )}
      </Section>

      {/* Yatırım */}
      <Section title="Yatırım Analizi">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-400">Toplam Kurulum Maliyeti</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {result.toplamMaliyet.toLocaleString("tr-TR")} TL
            </span>
          </div>
          {Object.entries(result.sistemMaliyetiKalemler).map(([k, v]) => (
            <div key={k} className="flex justify-between py-1 pl-4 text-zinc-500 dark:text-zinc-400">
              <span>— {k}</span>
              <span>{v.toLocaleString("tr-TR")} TL</span>
            </div>
          ))}
          <div className="flex justify-between py-1 pl-4 text-zinc-500 dark:text-zinc-400">
            <span>— güneş paneli ({result.panelSayisi} × {PANEL_BIRIM_FIYATI.toLocaleString("tr-TR")} TL)</span>
            <span>{(result.panelSayisi * PANEL_BIRIM_FIYATI).toLocaleString("tr-TR")} TL</span>
          </div>
          {result.turbineSayisi > 0 && (
            <div className="flex justify-between py-1 pl-4 text-zinc-500 dark:text-zinc-400">
              <span>— rüzgar türbini ({result.turbineSayisi} × {TURBINE_BIRIM_FIYATI.toLocaleString("tr-TR")} TL)</span>
              <span>{(result.turbineSayisi * TURBINE_BIRIM_FIYATI).toLocaleString("tr-TR")} TL</span>
            </div>
          )}
          <div className="flex justify-between py-1.5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-400">Tahmini Yıllık Kazanç</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {fmt(result.yillikKazanc)} TL
            </span>
          </div>
          {result.amortismanYil !== null ? (
            <>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-600 dark:text-zinc-400">Amortisman Süresi</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{fmt(result.amortismanYil, 1)} yıl</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-600 dark:text-zinc-400">Sistem Ömrü</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{SISTEM_OMRU} yıl</span>
              </div>
              <div className={`flex justify-between py-1.5 rounded-lg px-3 ${
                result.omurBoyuKazanc >= 0
                  ? "bg-emerald-50 dark:bg-emerald-950/30"
                  : "bg-red-50 dark:bg-red-950/30"
              }`}>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">Ömür Boyu Net Kazanç</span>
                <span className={`font-bold ${result.omurBoyuKazanc >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                  {result.omurBoyuKazanc >= 0 ? "+" : ""}{fmt(result.omurBoyuKazanc)} TL
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-400">Amortisman hesaplanamadı (yıllık kazanç yok).</p>
          )}
        </div>
      </Section>
    </div>
  );
}
