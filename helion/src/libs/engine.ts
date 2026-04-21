import {
  BATARYA_KAPASITESI,
  GRID_FIYATI,
  SATIS_FIYATI,
  SISTEM_OMRU,
  PANEL_BIRIM_FIYATI,
  TURBINE_BIRIM_FIYATI,
  SOLAR_MALIYETI,
  WIND_MALIYETI,
  DOGU_SEHIRLER,
  URETIM_VERILERI,
} from "./constants";
import type { SimulationInput, SimulationResult } from "./types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randUniform(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function round(n: number, decimals = 3): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

function uretimHesapla(
  sehir: string,
  gun: number,
  panelSayisi: number,
  turbineSayisi: number
): { ges: number; res: number; overheatPanelSayisi: number } {
  const [gesBirim, , , resBirim] = URETIM_VERILERI[sehir][gun];

  let gesOrt = gesBirim * panelSayisi;
  const resOrt = resBirim * turbineSayisi;
  let overheatPanelSayisi = 0;

  if (DOGU_SEHIRLER.has(sehir) && Math.random() < 0.25) {
    overheatPanelSayisi = randInt(1, Math.min(3, panelSayisi));
    const kayipOran = overheatPanelSayisi / panelSayisi;
    gesOrt = round(gesOrt * (1 - kayipOran), 2);
  }

  const gesSapma = randUniform(-0.04, 0.04);
  const resSapma = randUniform(-0.04, 0.04);

  return {
    ges: round(gesOrt * (1 + gesSapma), 2),
    res: round(resOrt * (1 + resSapma), 2),
    overheatPanelSayisi,
  };
}

function enerjiDengesiHesapla(
  ges: number,
  res: number,
  tuketim: number,
  batarya: number
): { bataryaSon: number; gridKullanim: number; fazlaEnerji: number; toplamUretim: number } {
  const toplamUretim = ges + res;
  const denge = toplamUretim - tuketim;
  let gridKullanim = 0;
  let fazlaEnerji = 0;

  if (denge >= 0) {
    const bosKapasite = BATARYA_KAPASITESI - batarya;
    if (denge <= bosKapasite) {
      batarya += denge;
    } else {
      fazlaEnerji = round(denge - bosKapasite, 3);
      batarya = BATARYA_KAPASITESI;
    }
  } else {
    const acik = Math.abs(denge);
    if (batarya >= acik) {
      batarya = round(batarya - acik, 3);
    } else {
      gridKullanim = round(acik - batarya, 3);
      batarya = 0;
    }
  }

  return {
    bataryaSon: round(Math.min(batarya, BATARYA_KAPASITESI), 3),
    gridKullanim,
    fazlaEnerji,
    toplamUretim,
  };
}

function kesintiSimulasyonu(
  tuketim: number,
  toplamUretim: number,
  bataryaMevcut: number
): { kesintiSuresi: number; kurtarilanSaat: number; blackoutSaat: number } {
  const kesintiSuresi = randInt(0, 5);

  if (kesintiSuresi === 0) return { kesintiSuresi: 0, kurtarilanSaat: 0, blackoutSaat: 0 };

  const saatlikTuketim = tuketim / 24;
  const saatlikUretim = toplamUretim / 24;
  const saatlikAcik = Math.max(0, saatlikTuketim - saatlikUretim);

  if (saatlikAcik === 0) {
    return { kesintiSuresi, kurtarilanSaat: kesintiSuresi, blackoutSaat: 0 };
  }

  const maxKurtarilan = bataryaMevcut / saatlikAcik;
  const kurtarilanSaat = round(Math.min(kesintiSuresi, maxKurtarilan), 2);
  const blackoutSaat = round(kesintiSuresi - kurtarilanSaat, 2);

  return { kesintiSuresi, kurtarilanSaat, blackoutSaat };
}

function senaryoBelirle(
  toplamUretim: number,
  tuketim: number,
  fazlaEnerji: number,
  gridKullanim: number,
  blackoutSaat: number
): number {
  const denge = toplamUretim - tuketim;
  if (denge >= 0 && fazlaEnerji > 0) return 1;
  if (denge >= 0) return 4;
  if (gridKullanim > 0 && blackoutSaat > 0) return 5;
  if (gridKullanim > 0) return 2;
  if (blackoutSaat > 0) return 3;
  return 4;
}

function ekonomikAnaliz(
  tuketim: number,
  gridKullanim: number,
  fazlaEnerji: number,
  satisYap: boolean,
  panelSayisi: number,
  turbineSayisi: number
): {
  toplamMaliyet: number;
  sistemMaliyetiKalemler: Record<string, number>;
  faturaSystemsiz: number;
  faturaSystemli: number;
  satisGeliri: number;
  gunlukKazanc: number;
  aylikFaturaYok: number;
  aylikFaturaYeys: number;
  aylikKazanc: number;
  yillikKazanc: number;
  amortismanYil: number | null;
  omurBoyuKazanc: number;
} {
  const sistemMaliyetiKalemler: Record<string, number> = turbineSayisi > 0
    ? { ...SOLAR_MALIYETI, ...WIND_MALIYETI }
    : { ...SOLAR_MALIYETI };

  const toplamMaliyet =
    Object.values(sistemMaliyetiKalemler).reduce((a, b) => a + b, 0) +
    panelSayisi * PANEL_BIRIM_FIYATI +
    turbineSayisi * TURBINE_BIRIM_FIYATI;

  const faturaSystemsiz = round(tuketim * GRID_FIYATI, 2);
  const faturaSystemli = round(gridKullanim * GRID_FIYATI, 2);
  const satisGeliri = satisYap ? round(fazlaEnerji * SATIS_FIYATI, 2) : 0;
  const gunlukKazanc = round(faturaSystemsiz - faturaSystemli + satisGeliri, 2);
  const aylikKazanc = round(gunlukKazanc * 31, 2);
  const aylikFaturaYeys = round(faturaSystemli * 31, 2);
  const aylikFaturaYok = round(faturaSystemsiz * 31, 2);
  const yillikKazanc = round(gunlukKazanc * 365, 2);

  let amortismanYil: number | null = null;
  let omurBoyuKazanc: number;

  if (yillikKazanc > 0) {
    amortismanYil = round(toplamMaliyet / yillikKazanc, 1);
    omurBoyuKazanc = round(yillikKazanc * SISTEM_OMRU - toplamMaliyet, 2);
  } else {
    omurBoyuKazanc = round(-toplamMaliyet, 2);
  }

  return {
    toplamMaliyet,
    sistemMaliyetiKalemler,
    faturaSystemsiz,
    faturaSystemli,
    satisGeliri,
    gunlukKazanc,
    aylikFaturaYok,
    aylikFaturaYeys,
    aylikKazanc,
    yillikKazanc,
    amortismanYil,
    omurBoyuKazanc,
  };
}

export function simulate(input: SimulationInput): SimulationResult {
  const { sehir, gun, tuketim, bataryaYuzde, panelSayisi, turbineSayisi, satisYap } = input;

  const bataryaBas = round(BATARYA_KAPASITESI * bataryaYuzde / 100, 2);

  const { ges, res, overheatPanelSayisi } = uretimHesapla(sehir, gun, panelSayisi, turbineSayisi);
  const toplamUretim = round(ges + res, 2);

  const { bataryaSon, gridKullanim, fazlaEnerji } = enerjiDengesiHesapla(
    ges, res, tuketim, bataryaBas
  );

  const { kesintiSuresi, kurtarilanSaat, blackoutSaat } = kesintiSimulasyonu(
    tuketim, toplamUretim, bataryaSon
  );

  const senaryoNo = senaryoBelirle(toplamUretim, tuketim, fazlaEnerji, gridKullanim, blackoutSaat);

  const ekonomi = ekonomikAnaliz(tuketim, gridKullanim, fazlaEnerji, satisYap, panelSayisi, turbineSayisi);

  return {
    sehir,
    gun,
    tuketim,
    ges,
    res,
    toplamUretim,
    overheatPanelSayisi,
    panelSayisi,
    turbineSayisi,
    bataryaBas,
    bataryaSon,
    gridKullanim,
    fazlaEnerji,
    satisYap,
    kesintiSuresi,
    kurtarilanSaat,
    blackoutSaat,
    senaryoNo,
    faturaSystemsiz: ekonomi.faturaSystemsiz,
    faturaSystemli: ekonomi.faturaSystemli,
    satisGeliri: ekonomi.satisGeliri,
    gunlukKazanc: ekonomi.gunlukKazanc,
    aylikFaturaYok: ekonomi.aylikFaturaYok,
    aylikFaturaYeys: ekonomi.aylikFaturaYeys,
    aylikKazanc: ekonomi.aylikKazanc,
    yillikKazanc: ekonomi.yillikKazanc,
    amortismanYil: ekonomi.amortismanYil,
    omurBoyuKazanc: ekonomi.omurBoyuKazanc,
    toplamMaliyet: ekonomi.toplamMaliyet,
    sistemMaliyetiKalemler: ekonomi.sistemMaliyetiKalemler,
  };
}
