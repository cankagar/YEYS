export interface SimulationInput {
  sehir: string;
  gun: number;
  tuketim: number;
  bataryaYuzde: number;
  panelSayisi: number;
  turbineSayisi: number;
  satisYap: boolean;
}

export interface SimulationResult {
  sehir: string;
  gun: number;
  tuketim: number;
  // Üretim
  ges: number;
  res: number;
  toplamUretim: number;
  overheatPanelSayisi: number;
  panelSayisi: number;
  turbineSayisi: number;
  // Batarya
  bataryaBas: number;
  bataryaSon: number;
  // Enerji akışı
  gridKullanim: number;
  fazlaEnerji: number;
  satisYap: boolean;
  // Kesinti
  kesintiSuresi: number;
  kurtarilanSaat: number;
  blackoutSaat: number;
  // Senaryo
  senaryoNo: number;
  // Ekonomi
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
  toplamMaliyet: number;
  sistemMaliyetiKalemler: Record<string, number>;
}
