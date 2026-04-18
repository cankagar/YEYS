import random

# ==============================================================
# SİSTEM SABİTLERİ
# ==============================================================
BATARYA_KAPASITESI = 10.0
SISTEM_MALIYETI    = 420_000
GRID_FIYATI        = 5
SATIS_FIYATI       = 1.10
SISTEM_OMRU        = 30
PANEL_SAYISI       = 12
DOGU_SEHIRLER      = {"VAN", "ŞANLIURFA"}

# ==============================================================
# BÖLÜM 1: VERİ TABLOSU
# (GES_ort, GES_alt, GES_ust, RES_ort, RES_alt, RES_ust) kWh/gün
# ==============================================================
URETIM_VERILERI = {
    "İSTANBUL": {
        1:  (16.56,13.25,19.87,5.52,4.42,6.62),
        2:  (16.89,13.51,20.27,5.52,4.42,6.62),
        3:  (17.22,13.78,20.66,4.32,3.28,5.36),
        4:  (17.55,14.04,21.06,6.24,4.99,7.49),
        5:  (17.88,14.30,21.46,6.24,4.99,7.49),
        6:  (18.21,14.57,21.85,6.24,4.99,7.49),
        7:  (18.54,14.83,22.25,6.24,4.99,7.49),
        8:  (18.87,15.10,22.44,6.24,4.99,7.49),
        9:  (19.20,15.36,22.99,6.24,4.99,7.49),
        10: (19.53,15.62,23.44,6.24,4.99,7.49),
        11: (19.86,15.89,23.83,5.52,4.42,6.62),
        12: (20.19,16.15,24.23,6.24,4.99,7.49),
        13: (20.52,16.42,24.62,6.24,4.99,7.49),
        14: (20.85,16.68,25.02,5.52,4.42,6.62),
        15: (21.18,16.94,25.42,5.52,4.42,6.62),
        16: (21.51,17.21,25.81,4.32,3.28,5.36),
        17: (21.84,17.47,26.21,5.52,4.42,6.62),
        18: (22.17,17.74,26.60,5.52,4.42,6.62),
        19: (22.50,18.00,27.00,6.24,4.99,7.49),
        20: (22.83,18.26,27.40,5.52,4.42,6.62),
        21: (23.16,18.53,27.79,5.52,4.42,6.62),
        22: (23.49,18.79,28.19,5.52,4.42,6.62),
        23: (23.82,19.06,28.58,5.52,4.42,6.62),
        24: (24.15,19.32,28.98,5.52,4.42,6.62),
        25: (24.48,19.58,29.38,5.52,4.42,6.62),
        26: (24.81,19.85,29.77,6.24,4.99,7.49),
        27: (25.14,20.11,30.17,5.52,4.42,6.62),
        28: (25.47,20.38,30.56,5.52,4.42,6.62),
        29: (25.80,20.64,30.96,6.24,4.99,7.49),
        30: (26.13,20.90,31.36,4.32,3.28,5.36),
        31: (26.46,21.17,31.75,5.52,4.42,6.62),
    },
    "İZMİR": {
        1:  (20.19,16.15,24.23,2.64,1.72,3.56),
        2:  (20.52,16.42,24.62,1.92,1.15,2.69),
        3:  (20.85,16.68,25.02,2.64,1.72,3.56),
        4:  (21.18,16.94,25.42,2.64,1.72,3.56),
        5:  (21.51,17.21,25.81,3.48,2.44,4.52),
        6:  (21.84,17.47,26.21,3.48,2.44,4.52),
        7:  (22.17,17.74,26.60,3.48,2.44,4.52),
        8:  (22.50,18.00,27.00,2.64,1.72,3.56),
        9:  (22.83,18.26,27.40,3.00,2.10,3.90),
        10: (23.16,18.53,27.79,2.64,1.72,3.56),
        11: (23.49,18.79,28.19,2.64,1.72,3.56),
        12: (23.82,19.06,28.58,3.00,2.10,3.90),
        13: (24.15,19.32,28.98,3.00,2.10,3.90),
        14: (24.48,19.58,29.38,3.00,2.10,3.90),
        15: (24.81,19.85,29.77,3.00,2.10,3.90),
        16: (25.14,20.11,30.17,2.64,1.72,3.56),
        17: (25.47,20.38,30.56,1.92,1.15,2.69),
        18: (25.80,20.64,30.96,1.92,1.15,2.69),
        19: (26.13,20.90,31.36,2.64,1.72,3.56),
        20: (26.46,21.17,31.75,2.64,1.72,3.56),
        21: (26.79,21.43,32.15,2.64,1.72,3.56),
        22: (27.12,21.70,32.54,3.00,2.10,3.90),
        23: (27.45,21.96,32.94,3.00,2.10,3.90),
        24: (27.78,22.22,33.34,3.00,2.10,3.90),
        25: (28.11,22.49,33.73,2.64,1.72,3.56),
        26: (28.44,22.75,34.13,3.00,2.10,3.90),
        27: (28.77,23.02,34.52,2.64,1.72,3.56),
        28: (29.10,23.28,34.92,2.64,1.72,3.56),
        29: (29.43,23.54,35.32,3.00,2.10,3.90),
        30: (29.76,23.81,35.71,2.64,1.72,3.56),
        31: (30.09,24.07,36.11,3.00,2.10,3.90),
    },
    "ANTALYA": {
        1:  (23.49,18.79,28.19,1.08,0.54,1.62),
        2:  (23.82,19.06,28.58,0.84,0.42,1.26),
        3:  (24.15,19.32,28.98,1.08,0.54,1.62),
        4:  (24.48,19.58,29.38,1.08,0.54,1.62),
        5:  (24.81,19.85,29.77,0.84,0.42,1.26),
        6:  (25.14,20.11,30.17,1.08,0.54,1.62),
        7:  (25.47,20.38,30.56,1.08,0.54,1.62),
        8:  (25.80,20.64,30.96,0.84,0.42,1.26),
        9:  (26.13,20.90,31.36,1.08,0.54,1.62),
        10: (26.46,21.17,31.75,1.08,0.54,1.62),
        11: (26.79,21.43,32.15,0.84,0.42,1.26),
        12: (27.12,21.70,32.54,0.84,0.42,1.26),
        13: (27.45,21.96,32.94,0.84,0.42,1.26),
        14: (27.78,22.22,33.34,1.08,0.54,1.62),
        15: (28.11,22.49,33.73,1.08,0.54,1.62),
        16: (28.44,22.75,34.13,1.08,0.54,1.62),
        17: (28.77,23.02,34.52,1.08,0.54,1.62),
        18: (29.10,23.28,34.92,1.08,0.54,1.62),
        19: (29.43,23.54,35.32,1.08,0.54,1.62),
        20: (29.76,23.81,35.71,1.08,0.54,1.62),
        21: (30.09,24.07,36.11,1.08,0.54,1.62),
        22: (30.42,24.34,36.50,1.08,0.54,1.62),
        23: (30.75,24.60,36.90,1.08,0.54,1.62),
        24: (31.08,24.86,37.30,1.32,0.66,1.98),
        25: (31.41,25.13,37.69,1.08,0.54,1.62),
        26: (31.74,25.39,38.09,1.32,0.66,1.98),
        27: (32.07,25.66,38.48,1.08,0.54,1.62),
        28: (32.40,25.92,38.88,1.08,0.54,1.62),
        29: (32.73,26.18,39.28,1.08,0.54,1.62),
        30: (33.06,26.45,39.67,0.84,0.42,1.26),
        31: (33.39,26.71,40.07,0.84,0.42,1.26),
    },
    "ANKARA": {
        1:  (19.86,15.89,23.83,2.64,1.72,3.56),
        2:  (20.19,16.15,24.23,2.64,1.72,3.56),
        3:  (20.52,16.42,24.62,2.64,1.72,3.56),
        4:  (20.85,16.68,25.02,2.64,1.72,3.56),
        5:  (21.18,16.94,25.42,2.64,1.72,3.56),
        6:  (21.51,17.21,25.81,3.00,2.10,3.90),
        7:  (21.84,17.47,26.21,3.00,2.10,3.90),
        8:  (22.17,17.74,26.60,3.00,2.10,3.90),
        9:  (22.50,18.00,27.00,2.64,1.72,3.56),
        10: (22.83,18.26,27.40,2.64,1.72,3.56),
        11: (23.16,18.53,27.79,1.68,1.01,2.35),
        12: (23.49,18.79,28.19,2.64,1.72,3.56),
        13: (23.82,19.06,28.58,2.64,1.72,3.56),
        14: (24.15,19.32,28.98,2.64,1.72,3.56),
        15: (24.48,19.58,29.38,2.64,1.72,3.56),
        16: (24.81,19.85,29.77,2.64,1.72,3.56),
        17: (25.14,20.11,30.17,2.64,1.72,3.56),
        18: (25.47,20.38,30.56,3.00,2.10,3.90),
        19: (25.80,20.64,30.96,2.64,1.72,3.56),
        20: (26.13,20.90,31.36,2.64,1.72,3.56),
        21: (26.46,21.17,31.75,2.64,1.72,3.56),
        22: (26.79,21.43,32.15,2.64,1.72,3.56),
        23: (27.12,21.70,32.54,3.00,2.10,3.90),
        24: (27.45,21.96,32.94,3.00,2.10,3.90),
        25: (27.78,22.22,33.34,1.92,1.15,2.69),
        26: (28.11,22.49,33.73,2.64,1.72,3.56),
        27: (28.44,22.75,34.13,1.92,1.15,2.69),
        28: (28.77,23.02,34.52,2.64,1.72,3.56),
        29: (29.10,23.28,34.92,2.64,1.72,3.56),
        30: (29.43,23.54,35.32,2.64,1.72,3.56),
        31: (29.76,23.81,35.71,3.00,2.10,3.90),
    },
    "SAMSUN": {
        1:  (15.24,12.19,18.29,3.48,2.44,4.52),
        2:  (15.57,12.46,18.68,5.52,4.42,6.62),
        3:  (15.90,12.72,19.08,5.52,4.42,6.62),
        4:  (16.23,12.98,19.48,4.32,3.28,5.36),
        5:  (16.56,13.25,19.87,5.52,4.42,6.62),
        6:  (16.89,13.51,20.27,5.52,4.42,6.62),
        7:  (17.22,13.78,19.08,5.52,4.42,6.62),
        8:  (17.55,14.04,21.06,4.32,3.28,5.36),
        9:  (17.88,14.30,21.46,4.32,3.28,5.36),
        10: (18.21,14.57,21.85,5.52,4.42,6.62),
        11: (18.54,14.83,22.25,3.00,2.10,3.90),
        12: (18.87,15.10,22.44,3.48,2.44,4.52),
        13: (19.20,15.36,22.99,4.32,3.28,5.36),
        14: (19.53,15.62,23.44,5.52,4.42,6.62),
        15: (19.86,15.89,23.83,5.52,4.42,6.62),
        16: (20.19,16.15,24.23,6.24,4.99,7.49),
        17: (20.52,16.42,24.62,3.48,2.44,4.52),
        18: (20.85,16.68,25.02,6.24,4.99,7.49),
        19: (21.18,16.94,25.42,4.32,3.28,5.36),
        20: (21.51,17.21,25.81,4.32,3.28,5.36),
        21: (21.84,17.47,26.21,4.32,3.28,5.36),
        22: (22.17,17.74,26.60,5.52,4.42,6.62),
        23: (22.50,18.00,27.00,5.52,4.42,6.62),
        24: (22.83,18.26,27.40,4.32,3.28,5.36),
        25: (23.16,18.53,27.79,4.32,3.28,5.36),
        26: (23.49,18.79,28.19,3.48,2.44,4.52),
        27: (23.82,19.06,28.58,6.24,4.99,7.49),
        28: (24.15,19.32,28.98,4.32,3.28,5.36),
        29: (24.48,19.58,29.38,5.52,4.42,6.62),
        30: (24.81,19.85,29.77,3.48,2.44,4.52),
        31: (25.14,20.11,30.17,3.48,2.44,4.52),
    },
    "VAN": {
        1:  (20.85,16.68,25.02,1.32,0.66,1.98),
        2:  (21.18,16.94,25.42,1.68,1.01,2.35),
        3:  (21.51,17.21,25.81,1.92,1.15,2.69),
        4:  (21.84,17.47,26.21,1.68,1.01,2.35),
        5:  (22.17,17.74,26.60,1.68,1.01,2.35),
        6:  (22.50,18.00,27.00,1.68,1.01,2.35),
        7:  (22.83,18.26,27.40,1.68,1.01,2.35),
        8:  (23.16,18.53,27.79,1.68,1.01,2.35),
        9:  (23.49,18.79,28.19,1.68,1.01,2.35),
        10: (23.82,19.06,28.58,1.68,1.01,2.35),
        11: (24.15,19.32,28.98,1.68,1.01,2.35),
        12: (24.48,19.58,29.38,1.68,1.01,2.35),
        13: (24.81,19.85,29.77,1.92,1.15,2.69),
        14: (25.14,20.11,30.17,1.68,1.01,2.35),
        15: (25.47,20.38,30.56,1.68,1.01,2.35),
        16: (25.80,20.64,30.96,1.68,1.01,2.35),
        17: (26.13,20.90,31.36,1.92,1.15,2.69),
        18: (26.46,21.17,31.75,2.64,1.72,3.56),
        19: (26.79,21.43,32.15,1.92,1.15,2.69),
        20: (27.12,21.70,32.54,1.68,1.01,2.35),
        21: (27.45,21.96,32.94,1.32,0.66,1.98),
        22: (27.78,22.22,33.34,1.68,1.01,2.35),
        23: (28.11,22.49,33.73,2.64,1.72,3.56),
        24: (28.44,22.75,34.13,2.64,1.72,3.56),
        25: (28.77,23.02,34.52,2.64,1.72,3.56),
        26: (29.10,23.28,34.92,2.64,1.72,3.56),
        27: (29.43,23.54,35.32,1.68,1.01,2.35),
        28: (29.76,23.81,35.71,3.00,2.10,3.90),
        29: (30.09,24.07,36.11,1.92,1.15,2.69),
        30: (30.42,24.34,36.50,1.68,1.01,2.35),
        31: (30.75,24.60,36.90,1.92,1.15,2.69),
    },
    "ŞANLIURFA": {
        1:  (25.14,20.11,30.17,3.48,2.44,4.52),
        2:  (25.47,20.38,30.56,3.48,2.44,4.52),
        3:  (25.80,20.64,30.96,3.48,2.44,4.52),
        4:  (26.13,20.90,31.36,3.48,2.44,4.52),
        5:  (26.46,21.17,31.75,3.48,2.44,4.52),
        6:  (26.79,21.43,32.15,3.48,2.44,4.52),
        7:  (27.12,21.70,32.54,3.48,2.44,4.52),
        8:  (27.45,21.96,32.94,3.00,2.10,3.90),
        9:  (27.78,22.22,33.34,3.00,2.10,3.90),
        10: (28.11,22.49,33.73,3.00,2.10,3.90),
        11: (28.44,22.75,34.13,3.48,2.44,4.52),
        12: (28.77,23.02,34.52,3.48,2.44,4.52),
        13: (29.10,23.28,34.92,5.52,4.42,6.62),
        14: (29.43,23.54,35.32,4.32,3.28,5.36),
        15: (29.76,23.81,35.71,4.32,3.28,5.36),
        16: (30.09,24.07,36.11,3.48,2.44,4.52),
        17: (30.42,24.34,36.50,4.32,3.28,5.36),
        18: (30.75,24.60,36.90,6.24,4.99,7.49),
        19: (31.08,24.86,37.30,5.52,4.42,6.62),
        20: (31.41,25.13,37.69,3.48,2.44,4.52),
        21: (31.74,25.39,38.09,4.32,3.28,5.36),
        22: (32.07,25.66,38.48,5.52,4.42,6.62),
        23: (32.40,25.92,38.88,6.24,4.99,7.49),
        24: (32.73,26.18,39.28,6.24,4.99,7.49),
        25: (33.06,26.45,39.67,6.24,4.99,7.49),
        26: (33.39,26.71,40.07,3.48,2.44,4.52),
        27: (33.72,26.98,40.46,6.24,4.99,7.49),
        28: (34.05,27.24,40.86,6.84,5.47,8.21),
        29: (34.38,27.50,41.26,6.24,4.99,7.49),
        30: (34.71,27.77,41.65,5.52,4.42,6.62),
        31: (35.04,28.03,42.05,6.84,5.47,8.21),
    },
}

# ==============================================================
# BÖLÜM 2: GİRİŞ SİSTEMİ
# ==============================================================
def veri_al():
    print("\n" + "=" * 65)
    print("      YENİLENEBİLİR ENERJİ YÖNETİM SİSTEMİ (YEYS)")
    print("      Mayıs Ayı Simülasyonu")
    print("=" * 65)

    sehirler = list(URETIM_VERILERI.keys())
    print("\nMevcut şehirler:")
    for i, s in enumerate(sehirler, 1):
        print(f"  {i}. {s}")

    while True:
        try:
            secim = int(input("\nŞehir numarasını seçin: "))
            if 1 <= secim <= len(sehirler):
                sehir = sehirler[secim - 1]
                break
            print(f"  Hata: 1-{len(sehirler)} arasında bir değer girin.")
        except ValueError:
            print("  Hata: Geçerli bir sayı girin.")

    while True:
        try:
            gun = int(input(f"\nMayıs ayından simüle edilecek günü girin (1-31): "))
            if 1 <= gun <= 31:
                break
            print("  Hata: 1-31 arasında bir gün girin.")
        except ValueError:
            print("  Hata: Geçerli bir sayı girin.")

    while True:
        try:
            tuketim = float(input("\nGünlük elektrik tüketiminiz (kWh): "))
            if tuketim > 0:
                break
            print("  Hata: Tüketim 0'dan büyük olmalıdır.")
        except ValueError:
            print("  Hata: Geçerli bir sayı girin.")

    while True:
        try:
            batarya_yuzde = float(input(f"\nBatarya başlangıç doluluk seviyesi (0-100 %): "))
            if 0 <= batarya_yuzde <= 100:
                break
            print("  Hata: 0-100 arasında bir değer girin.")
        except ValueError:
            print("  Hata: Geçerli bir sayı girin.")

    while True:
        secim = input(
            f"\nFazla enerjiyi şebekeye satmak ister misiniz?"
            f"\n  ({SATIS_FIYATI:.2f} TL/kWh satış fiyatı)"
            f"\n  [E] Evet, sat  /  [H] Hayır, toprağa ver: "
        ).strip().upper()
        if secim in ("E", "H"):
            satis_yap = secim == "E"
            break
        print("  Hata: E veya H girin.")

    return sehir, gun, tuketim, batarya_yuzde, satis_yap


# ==============================================================
# BÖLÜM 3: ÜRETİM HESAPLAMA
# ==============================================================
def uretim_hesapla(sehir, gun):
    ges_ort, _, _, res_ort, _, _ = URETIM_VERILERI[sehir][gun]

    overheat_panel_sayisi = 0

    # OVER HEAT: doğu şehirlerde %25 ihtimalle panel aşırı ısınması
    if sehir in DOGU_SEHIRLER:
        if random.random() < 0.25:
            overheat_panel_sayisi = random.randint(1, 3)
            kayip_oran = overheat_panel_sayisi / PANEL_SAYISI
            ges_ort = round(ges_ort * (1 - kayip_oran), 2)

    # ±%3-4 rastgele sapma
    ges_sapma = random.uniform(-0.04, 0.04)
    res_sapma = random.uniform(-0.04, 0.04)
    ges_uretim = round(ges_ort * (1 + ges_sapma), 2)
    res_uretim = round(res_ort * (1 + res_sapma), 2)

    return ges_uretim, res_uretim, overheat_panel_sayisi


# ==============================================================
# BÖLÜM 4: ENERJİ DENGESİ (ANA AKIŞ)
# ==============================================================
def enerji_dengesi_hesapla(ges, res, tuketim, batarya):
    toplam_uretim = ges + res
    denge = toplam_uretim - tuketim

    grid_kullanim  = 0.0
    topraga_atilan = 0.0

    if denge >= 0:
        bos_kapasite = BATARYA_KAPASITESI - batarya
        if denge <= bos_kapasite:
            batarya += denge
        else:
            topraga_atilan = round(denge - bos_kapasite, 3)
            batarya = BATARYA_KAPASITESI
    else:
        acik = abs(denge)
        if batarya >= acik:
            batarya = round(batarya - acik, 3)
        else:
            grid_kullanim = round(acik - batarya, 3)
            batarya = 0.0

    batarya = round(min(batarya, BATARYA_KAPASITESI), 3)
    return batarya, grid_kullanim, topraga_atilan, toplam_uretim


# ==============================================================
# BÖLÜM 5: KESİNTİ SİMÜLASYONU
# ==============================================================
def kesinti_simulasyonu(tuketim, toplam_uretim, batarya_mevcut):
    kesinti_suresi = random.randint(0, 5)

    if kesinti_suresi == 0:
        return 0, 0.0, 0.0

    saatlik_tuketim = tuketim / 24
    saatlik_uretim  = toplam_uretim / 24
    saatlik_acik    = max(0.0, saatlik_tuketim - saatlik_uretim)

    if saatlik_acik == 0:
        # Yenilenebilir üretim kesinti boyunca tüketimi karşılıyor
        return kesinti_suresi, float(kesinti_suresi), 0.0

    max_kurtarilan = batarya_mevcut / saatlik_acik
    kurtarilan     = round(min(float(kesinti_suresi), max_kurtarilan), 2)
    blackout_saat  = round(kesinti_suresi - kurtarilan, 2)

    return kesinti_suresi, kurtarilan, blackout_saat


# ==============================================================
# BÖLÜM 6: SENARYO BELİRLEME
# ==============================================================
def senaryo_belirle(toplam_uretim, tuketim, topraga_atilan, grid_kullanim, blackout_saat):
    denge = toplam_uretim - tuketim

    if denge >= 0 and topraga_atilan > 0:
        return 1   # Üretti, batarya doldu, fazla toprağa
    if denge >= 0:
        return 4   # Üretti, kalan bataryaya verildi
    # denge < 0
    if grid_kullanim > 0 and blackout_saat > 0:
        return 5   # Grid devreye girdi, kesintide blackout
    if grid_kullanim > 0:
        return 2   # Batarya + grid karşıladı
    if blackout_saat > 0:
        return 3   # Batarya bitti, grid yok, blackout
    return 4       # Batarya tek başına karşıladı


# ==============================================================
# BÖLÜM 7: EKONOMİK ANALİZ
# ==============================================================
def ekonomik_analiz(tuketim, grid_kullanim, fazla_enerji, satis_yap):
    fatura_sistemsiz  = round(tuketim * GRID_FIYATI, 2)
    fatura_sistemli   = round(grid_kullanim * GRID_FIYATI, 2)
    satis_geliri      = round(fazla_enerji * SATIS_FIYATI, 2) if satis_yap else 0.0
    # Günlük net kazanç: fatura tasarrufu + varsa satış geliri
    gunluk_kazanc     = round(fatura_sistemsiz - fatura_sistemli + satis_geliri, 2)
    aylik_kazanc      = round(gunluk_kazanc * 31, 2)
    aylik_fatura_yeys = round(fatura_sistemli * 31, 2)
    aylik_fatura_yok  = round(fatura_sistemsiz * 31, 2)
    yillik_kazanc     = round(gunluk_kazanc * 365, 2)

    if yillik_kazanc > 0:
        amortisman_yil   = round(SISTEM_MALIYETI / yillik_kazanc, 1)
        omur_boyu_kazanc = round(yillik_kazanc * SISTEM_OMRU - SISTEM_MALIYETI, 2)
    else:
        amortisman_yil   = None
        omur_boyu_kazanc = round(-SISTEM_MALIYETI, 2)

    return (fatura_sistemsiz, fatura_sistemli, satis_geliri, gunluk_kazanc,
            aylik_fatura_yok, aylik_fatura_yeys, aylik_kazanc,
            yillik_kazanc, amortisman_yil, omur_boyu_kazanc)


# ==============================================================
# BÖLÜM 8: RAPOR
# ==============================================================
SENARYO_METINLERI = {
    1: "Uretim tüketimi karşıladı. Batarya doldu. Fazla enerji toprağa verildi.",
    2: "Uretim yetersiz kaldı. Batarya kullanıldı, bitti. Açık şebekeden sağlandı.",
    3: "Uretim yetersiz. Batarya bitti. Şebeke karşılayamadı. BLACKOUT oluştu.",
    4: "Uretim tüketimi karşıladı. Kalan enerji bataryaya verildi.",
    5: "Uretim yetersiz. Grid devreye girdi. Kesinti sırasında BLACKOUT oluştu.",
}


def rapor_goster(sehir, gun, tuketim, batarya_bas, batarya_son,
                 ges, res, toplam_uretim, grid_kullanim, fazla_enerji, satis_yap,
                 overheat_panel, kesinti_suresi, kurtarilan_saat, blackout_saat,
                 fatura_sistemsiz, fatura_sistemli, satis_geliri, gunluk_kazanc,
                 aylik_fatura_yok, aylik_fatura_yeys, aylik_kazanc,
                 yillik_kazanc, amortisman_yil, omur_boyu_kazanc, senaryo_no):

    denge          = round(toplam_uretim - tuketim, 3)
    batarya_degisim = round(batarya_son - batarya_bas, 3)
    bas_yuzde      = round(batarya_bas / BATARYA_KAPASITESI * 100, 1)
    son_yuzde      = round(batarya_son / BATARYA_KAPASITESI * 100, 1)

    ayrac = "=" * 65

    print("\n" + ayrac)
    print("           YEYS - SİMÜLASYON SONUÇ RAPORU")
    print(ayrac)
    print(f"  Sehir : {sehir:<15}  Tarih : {gun} Mayıs")
    print(f"  Batarya Kapasitesi : {BATARYA_KAPASITESI} kWh")
    print(ayrac)

    # OVER HEAT uyarısı
    if overheat_panel > 0:
        print(f"\n  *** OVER HEAT UYARISI ***")
        print(f"  {overheat_panel} güneş paneli aşırı ısınma nedeniyle devre dışı kaldı!")
        print(f"  GES üretimi {overheat_panel}/{PANEL_SAYISI} panel oranında düşürüldü.")
        print()

    print("--- ÜRETİM BİLGİLERİ " + "-" * 43)
    print(f"  GES (Güneş) Üretimi      : {ges:.2f} kWh")
    print(f"  RES (Rüzgar) Üretimi     : {res:.2f} kWh")
    print(f"  Toplam Üretim            : {toplam_uretim:.2f} kWh")
    print(f"  Günlük Tüketim           : {tuketim:.2f} kWh")
    if denge >= 0:
        print(f"  Enerji Dengesi           : +{denge:.2f} kWh  (fazla)")
    else:
        print(f"  Enerji Dengesi           : {denge:.2f} kWh  (açık)")

    print("\n--- BATARYA DURUMU " + "-" * 46)
    print(f"  Başlangıç Seviyesi       : {batarya_bas:.2f} kWh  (%{bas_yuzde})")
    print(f"  Bitiş Seviyesi           : {batarya_son:.2f} kWh  (%{son_yuzde})")
    if batarya_degisim >= 0:
        print(f"  Değişim                  : +{batarya_degisim:.2f} kWh  (şarj)")
    else:
        print(f"  Değişim                  : {batarya_degisim:.2f} kWh  (deşarj)")

    print("\n--- ENERJİ AKIŞI " + "-" * 47)
    print(f"  Şebekeden Çekilen        : {grid_kullanim:.2f} kWh")
    if satis_yap:
        print(f"  Şebekeye Satılan (Fazla) : {fazla_enerji:.2f} kWh  ({fazla_enerji * SATIS_FIYATI:.2f} TL gelir)")
    else:
        print(f"  Toprağa Atılan (Fazla)   : {fazla_enerji:.2f} kWh")

    print("\n--- KESİNTİ SİMÜLASYONU " + "-" * 40)
    if kesinti_suresi == 0:
        print("  Bugün elektrik kesintisi yaşanmadı.")
    else:
        print(f"  Kesinti Süresi           : {kesinti_suresi} saat")
        print(f"  YEYS Koruması            : {kurtarilan_saat:.1f} saat")
        print(f"  Blackout Süresi          : {blackout_saat:.1f} saat")
        print()
        print(f"  Bugün toplam {kesinti_suresi} saatlik elektrik kesintisi yaşandı.")
        if kurtarilan_saat > 0:
            print(f"  Bu sistem olmasaydı bu {kesinti_suresi} saat boyunca elektrik")
            print(f"  kullanılamazdı. Ancak YEYS sayesinde {kurtarilan_saat:.1f} saatlik")
            print(f"  kesinti süresi boyunca enerji sağlandı.")
        if blackout_saat > 0:
            print(f"  Kalan {blackout_saat:.1f} saatlik sürede batarya tükendi: BLACKOUT.")

    print(f"\n--- SENARYO {senaryo_no} " + "-" * 52)
    print(f"  {SENARYO_METINLERI.get(senaryo_no, '')}")

    print("\n" + "-" * 65)
    print("  MALİYET ANALİZİ")
    print("-" * 65)
    print(f"  Şebeke Alış Fiyatı       : {GRID_FIYATI:.2f} TL/kWh")
    if satis_yap:
        print(f"  Şebekeye Satış Fiyatı    : {SATIS_FIYATI:.2f} TL/kWh")
    print(f"  YEYS olmadan fatura      : {fatura_sistemsiz:.2f} TL/gün")
    print(f"  YEYS ile fatura          : {fatura_sistemli:.2f} TL/gün")
    if satis_yap and satis_geliri > 0:
        print(f"  Satış Geliri             : +{satis_geliri:.2f} TL/gün")

    print("\n--- YATIRIM ANALİZİ " + "-" * 44)
    print(f"  Sistem Kurulum Maliyeti  : {SISTEM_MALIYETI:,} TL")
    print(f"  Tahmini Yıllık Kazanç    : {yillik_kazanc:,.2f} TL")
    if amortisman_yil is not None:
        print(f"  Amortisman Süresi        : {amortisman_yil:.1f} yıl")
        print(f"  Sistem Ömrü              : {SISTEM_OMRU} yıl")
        if omur_boyu_kazanc >= 0:
            print(f"  Ömür Boyu Net Kazanç     : +{omur_boyu_kazanc:,.2f} TL")
        else:
            print(f"  Ömür Boyu Net Kazanç     : {omur_boyu_kazanc:,.2f} TL  (zarar)")
    else:
        print("  Amortisman Süresi        : Hesaplanamadi (kazanç yok)")

    # --- KAR / ZARAR ÖZETİ ---
    print("\n" + "=" * 65)
    print("  FATURA KAR / ZARAR ÖZETİ")
    print("=" * 65)

    gunluk_isaretli = f"+{gunluk_kazanc:.2f} TL" if gunluk_kazanc >= 0 else f"{gunluk_kazanc:.2f} TL"
    aylik_isaretli  = f"+{aylik_kazanc:.2f} TL"  if aylik_kazanc  >= 0 else f"{aylik_kazanc:.2f} TL"

    print(f"\n  {'':5}{'YEYS OLMADAN':>18}{'YEYS İLE':>18}{'NET KAZANÇ':>18}")
    print(f"  {'-'*59}")
    print(f"  {'Günlük':<8}{fatura_sistemsiz:>14.2f} TL{fatura_sistemli:>14.2f} TL{gunluk_isaretli:>18}")
    print(f"  {'Aylık':<8}{aylik_fatura_yok:>14.2f} TL{aylik_fatura_yeys:>14.2f} TL{aylik_isaretli:>18}")
    print(f"  {'-'*59}")

    if satis_yap and satis_geliri > 0:
        print(f"\n  * Günlük kazanca {satis_geliri:.2f} TL satış geliri dahildir.")

    if gunluk_kazanc > 0:
        print(f"\n  Bugün YEYS sayesinde toplam {gunluk_kazanc:.2f} TL kazandın.")
        print(f"  Tüm Mayıs ayı boyunca bu kazancı sürdürseydin:")
        print(f"  Aylık toplam kazanç: {aylik_kazanc:.2f} TL")
    elif gunluk_kazanc == 0:
        print(f"\n  Bugün tüm enerji şebekeden karşılandı; YEYS etkisi yok.")
    else:
        print(f"\n  Bugün ek şebeke kullanımı nedeniyle {abs(gunluk_kazanc):.2f} TL ekstra ödendi.")

    print("=" * 65)


# ==============================================================
# ANA AKIŞ
# ==============================================================
def main():
    sehir, gun, tuketim, batarya_yuzde, satis_yap = veri_al()

    batarya_bas = round(BATARYA_KAPASITESI * batarya_yuzde / 100, 2)

    # Üretimi hesapla (sapma + overheat)
    ges, res, overheat_panel = uretim_hesapla(sehir, gun)
    toplam_uretim = round(ges + res, 2)

    # Enerji dengesi
    batarya_son, grid_kullanim, fazla_enerji, _ = enerji_dengesi_hesapla(
        ges, res, tuketim, batarya_bas
    )

    # Kesinti simülasyonu (kalan batarya üzerinden)
    kesinti_suresi, kurtarilan_saat, blackout_saat = kesinti_simulasyonu(
        tuketim, toplam_uretim, batarya_son
    )

    # Senaryo belirleme
    senaryo_no = senaryo_belirle(
        toplam_uretim, tuketim, fazla_enerji, grid_kullanim, blackout_saat
    )

    # Ekonomik analiz
    (fatura_sistemsiz, fatura_sistemli, satis_geliri, gunluk_kazanc,
     aylik_fatura_yok, aylik_fatura_yeys, aylik_kazanc,
     yillik_kazanc, amortisman_yil, omur_boyu_kazanc) = ekonomik_analiz(
        tuketim, grid_kullanim, fazla_enerji, satis_yap
    )

    # Rapor
    rapor_goster(
        sehir, gun, tuketim, batarya_bas, batarya_son,
        ges, res, toplam_uretim, grid_kullanim, fazla_enerji, satis_yap,
        overheat_panel, kesinti_suresi, kurtarilan_saat, blackout_saat,
        fatura_sistemsiz, fatura_sistemli, satis_geliri, gunluk_kazanc,
        aylik_fatura_yok, aylik_fatura_yeys, aylik_kazanc,
        yillik_kazanc, amortisman_yil, omur_boyu_kazanc, senaryo_no
    )


main()
