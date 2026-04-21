import random
  
# ==============================================================
# SİSTEM SABİTLERİ
# ==============================================================
BATARYA_KAPASITESI   = 10.0
SISTEM_MALIYETI      = {
    "altyapı": 100_000, 
    "inverter": 300_000
    }
GRID_FIYATI          = 5
SATIS_FIYATI         = 1.10
SISTEM_OMRU          = 30
PANEL_BIRIM_FIYATI   = 10_000
TURBINE_BIRIM_FIYATI = 10_000
DOGU_SEHIRLER        = {"VAN", "ŞANLIURFA"}

PAKETLER = {
    "basic": {"ad": "Helion Basic",      "panel": 8,  "turbine": 0},
    "pro":   {"ad": "Helion Pro (Enterprise)", "panel": 10, "turbine": 1},
}

# ==============================================================
# BÖLÜM 1: VERİ TABLOSU
# (GES_ort, GES_alt, GES_ust, RES_ort, RES_alt, RES_ust) kWh/gün
# ==============================================================

URETIM_VERILERI = {
    "İSTANBUL": {
        1: (1.38,1.1042,1.6558,0.46,0.3683,0.5517),
        2: (1.4075,1.1258,1.6892,0.46,0.3683,0.5517),
        3: (1.435,1.1483,1.7217,0.36,0.2733,0.4467),
        4: (1.4625,1.17,1.755,0.52,0.4158,0.6242),
        5: (1.49,1.1917,1.7883,0.52,0.4158,0.6242),
        6: (1.5175,1.2142,1.8208,0.52,0.4158,0.6242),
        7: (1.545,1.2358,1.8542,0.52,0.4158,0.6242),
        8: (1.5725,1.2583,1.87,0.52,0.4158,0.6242),
        9: (1.6,1.28,1.9158,0.52,0.4158,0.6242),
        10: (1.6275,1.3017,1.9533,0.52,0.4158,0.6242),
        11: (1.655,1.3242,1.9858,0.46,0.3683,0.5517),
        12: (1.6825,1.3458,2.0192,0.52,0.4158,0.6242),
        13: (1.71,1.3683,2.0517,0.52,0.4158,0.6242),
        14: (1.7375,1.39,2.085,0.46,0.3683,0.5517),
        15: (1.765,1.4117,2.1183,0.46,0.3683,0.5517),
        16: (1.7925,1.4342,2.1508,0.36,0.2733,0.4467),
        17: (1.82,1.4558,2.1842,0.46,0.3683,0.5517),
        18: (1.8475,1.4783,2.2167,0.46,0.3683,0.5517),
        19: (1.875,1.5,2.25,0.52,0.4158,0.6242),
        20: (1.9025,1.5217,2.2833,0.46,0.3683,0.5517),
        21: (1.93,1.5442,2.3158,0.46,0.3683,0.5517),
        22: (1.9575,1.5658,2.3492,0.46,0.3683,0.5517),
        23: (1.985,1.5883,2.3817,0.46,0.3683,0.5517),
        24: (2.0125,1.61,2.415,0.46,0.3683,0.5517),
        25: (2.04,1.6317,2.4483,0.46,0.3683,0.5517),
        26: (2.0675,1.6542,2.4808,0.52,0.4158,0.6242),
        27: (2.095,1.6758,2.5142,0.46,0.3683,0.5517),
        28: (2.1225,1.6983,2.5467,0.46,0.3683,0.5517),
        29: (2.15,1.72,2.58,0.52,0.4158,0.6242),
        30: (2.1775,1.7417,2.6133,0.36,0.2733,0.4467),
        31: (2.205,1.7642,2.6458,0.46,0.3683,0.5517),
    },
    "İZMİR": {
        1: (1.6825,1.3458,2.0192,0.22,0.1433,0.2967),
        2: (1.71,1.3683,2.0517,0.16,0.0958,0.2242),
        3: (1.7375,1.39,2.085,0.22,0.1433,0.2967),
        4: (1.765,1.4117,2.1183,0.22,0.1433,0.2967),
        5: (1.7925,1.4342,2.1508,0.29,0.2033,0.3767),
        6: (1.82,1.4558,2.1842,0.29,0.2033,0.3767),
        7: (1.8475,1.4783,2.2167,0.29,0.2033,0.3767),
        8: (1.875,1.5,2.25,0.22,0.1433,0.2967),
        9: (1.9025,1.5217,2.2833,0.25,0.175,0.325),
        10: (1.93,1.5442,2.3158,0.22,0.1433,0.2967),
        11: (1.9575,1.5658,2.3492,0.22,0.1433,0.2967),
        12: (1.985,1.5883,2.3817,0.25,0.175,0.325),
        13: (2.0125,1.61,2.415,0.25,0.175,0.325),
        14: (2.04,1.6317,2.4483,0.25,0.175,0.325),
        15: (2.0675,1.6542,2.4808,0.25,0.175,0.325),
        16: (2.095,1.6758,2.5142,0.22,0.1433,0.2967),
        17: (2.1225,1.6983,2.5467,0.16,0.0958,0.2242),
        18: (2.15,1.72,2.58,0.16,0.0958,0.2242),
        19: (2.1775,1.7417,2.6133,0.22,0.1433,0.2967),
        20: (2.205,1.7642,2.6458,0.22,0.1433,0.2967),
        21: (2.2325,1.7858,2.6792,0.22,0.1433,0.2967),
        22: (2.26,1.8083,2.7117,0.25,0.175,0.325),
        23: (2.2875,1.83,2.745,0.25,0.175,0.325),
        24: (2.315,1.8517,2.7783,0.25,0.175,0.325),
        25: (2.3425,1.8742,2.8108,0.22,0.1433,0.2967),
        26: (2.37,1.8958,2.8442,0.25,0.175,0.325),
        27: (2.3975,1.9183,2.8767,0.22,0.1433,0.2967),
        28: (2.425,1.94,2.91,0.22,0.1433,0.2967),
        29: (2.4525,1.9617,2.9433,0.25,0.175,0.325),
        30: (2.48,1.9842,2.9758,0.22,0.1433,0.2967),
        31: (2.5075,2.0058,3.0092,0.25,0.175,0.325),
    },
    "ANTALYA": {
        1: (1.9575,1.5658,2.3492,0.09,0.045,0.135),
        2: (1.985,1.5883,2.3817,0.07,0.035,0.105),
        3: (2.0125,1.61,2.415,0.09,0.045,0.135),
        4: (2.04,1.6317,2.4483,0.09,0.045,0.135),
        5: (2.0675,1.6542,2.4808,0.07,0.035,0.105),
        6: (2.095,1.6758,2.5142,0.09,0.045,0.135),
        7: (2.1225,1.6983,2.5467,0.09,0.045,0.135),
        8: (2.15,1.72,2.58,0.07,0.035,0.105),
        9: (2.1775,1.7417,2.6133,0.09,0.045,0.135),
        10: (2.205,1.7642,2.6458,0.09,0.045,0.135),
        11: (2.2325,1.7858,2.6792,0.07,0.035,0.105),
        12: (2.26,1.8083,2.7117,0.07,0.035,0.105),
        13: (2.2875,1.83,2.745,0.07,0.035,0.105),
        14: (2.315,1.8517,2.7783,0.09,0.045,0.135),
        15: (2.3425,1.8742,2.8108,0.09,0.045,0.135),
        16: (2.37,1.8958,2.8442,0.09,0.045,0.135),
        17: (2.3975,1.9183,2.8767,0.09,0.045,0.135),
        18: (2.425,1.94,2.91,0.09,0.045,0.135),
        19: (2.4525,1.9617,2.9433,0.09,0.045,0.135),
        20: (2.48,1.9842,2.9758,0.09,0.045,0.135),
        21: (2.5075,2.0058,3.0092,0.09,0.045,0.135),
        22: (2.535,2.0283,3.0417,0.09,0.045,0.135),
        23: (2.5625,2.05,3.075,0.09,0.045,0.135),
        24: (2.59,2.0717,3.1083,0.11,0.055,0.165),
        25: (2.6175,2.0942,3.1408,0.09,0.045,0.135),
        26: (2.645,2.1158,3.1742,0.11,0.055,0.165),
        27: (2.6725,2.1383,3.2067,0.09,0.045,0.135),
        28: (2.7,2.16,3.24,0.09,0.045,0.135),
        29: (2.7275,2.1817,3.2733,0.09,0.045,0.135),
        30: (2.755,2.2042,3.3058,0.07,0.035,0.105),
        31: (2.7825,2.2258,3.3392,0.07,0.035,0.105),
    },
    "ANKARA": {
        1: (1.655,1.3242,1.9858,0.22,0.1433,0.2967),
        2: (1.6825,1.3458,2.0192,0.22,0.1433,0.2967),
        3: (1.71,1.3683,2.0517,0.22,0.1433,0.2967),
        4: (1.7375,1.39,2.085,0.22,0.1433,0.2967),
        5: (1.765,1.4117,2.1183,0.22,0.1433,0.2967),
        6: (1.7925,1.4342,2.1508,0.25,0.175,0.325),
        7: (1.82,1.4558,2.1842,0.25,0.175,0.325),
        8: (1.8475,1.4783,2.2167,0.25,0.175,0.325),
        9: (1.875,1.5,2.25,0.22,0.1433,0.2967),
        10: (1.9025,1.5217,2.2833,0.22,0.1433,0.2967),
        11: (1.93,1.5442,2.3158,0.14,0.0842,0.1958),
        12: (1.9575,1.5658,2.3492,0.22,0.1433,0.2967),
        13: (1.985,1.5883,2.3817,0.22,0.1433,0.2967),
        14: (2.0125,1.61,2.415,0.22,0.1433,0.2967),
        15: (2.04,1.6317,2.4483,0.22,0.1433,0.2967),
        16: (2.0675,1.6542,2.4808,0.22,0.1433,0.2967),
        17: (2.095,1.6758,2.5142,0.22,0.1433,0.2967),
        18: (2.1225,1.6983,2.5467,0.25,0.175,0.325),
        19: (2.15,1.72,2.58,0.22,0.1433,0.2967),
        20: (2.1775,1.7417,2.6133,0.22,0.1433,0.2967),
        21: (2.205,1.7642,2.6458,0.22,0.1433,0.2967),
        22: (2.2325,1.7858,2.6792,0.22,0.1433,0.2967),
        23: (2.26,1.8083,2.7117,0.25,0.175,0.325),
        24: (2.2875,1.83,2.745,0.25,0.175,0.325),
        25: (2.315,1.8517,2.7783,0.16,0.0958,0.2242),
        26: (2.3425,1.8742,2.8108,0.22,0.1433,0.2967),
        27: (2.37,1.8958,2.8442,0.16,0.0958,0.2242),
        28: (2.3975,1.9183,2.8767,0.22,0.1433,0.2967),
        29: (2.425,1.94,2.91,0.22,0.1433,0.2967),
        30: (2.4525,1.9617,2.9433,0.22,0.1433,0.2967),
        31: (2.48,1.9842,2.9758,0.25,0.175,0.325),
    },
    "SAMSUN": {
        1: (1.27,1.0158,1.5242,0.29,0.2033,0.3767),
        2: (1.2975,1.0383,1.5567,0.46,0.3683,0.5517),
        3: (1.325,1.06,1.59,0.46,0.3683,0.5517),
        4: (1.3525,1.0817,1.6233,0.36,0.2733,0.4467),
        5: (1.38,1.1042,1.6558,0.46,0.3683,0.5517),
        6: (1.4075,1.1258,1.6892,0.46,0.3683,0.5517),
        7: (1.435,1.1483,1.59,0.46,0.3683,0.5517),
        8: (1.4625,1.17,1.755,0.36,0.2733,0.4467),
        9: (1.49,1.1917,1.7883,0.36,0.2733,0.4467),
        10: (1.5175,1.2142,1.8208,0.46,0.3683,0.5517),
        11: (1.545,1.2358,1.8542,0.25,0.175,0.325),
        12: (1.5725,1.2583,1.87,0.29,0.2033,0.3767),
        13: (1.6,1.28,1.9158,0.36,0.2733,0.4467),
        14: (1.6275,1.3017,1.9533,0.46,0.3683,0.5517),
        15: (1.655,1.3242,1.9858,0.46,0.3683,0.5517),
        16: (1.6825,1.3458,2.0192,0.52,0.4158,0.6242),
        17: (1.71,1.3683,2.0517,0.29,0.2033,0.3767),
        18: (1.7375,1.39,2.085,0.52,0.4158,0.6242),
        19: (1.765,1.4117,2.1183,0.36,0.2733,0.4467),
        20: (1.7925,1.4342,2.1508,0.36,0.2733,0.4467),
        21: (1.82,1.4558,2.1842,0.36,0.2733,0.4467),
        22: (1.8475,1.4783,2.2167,0.46,0.3683,0.5517),
        23: (1.875,1.5,2.25,0.46,0.3683,0.5517),
        24: (1.9025,1.5217,2.2833,0.36,0.2733,0.4467),
        25: (1.93,1.5442,2.3158,0.36,0.2733,0.4467),
        26: (1.9575,1.5658,2.3492,0.29,0.2033,0.3767),
        27: (1.985,1.5883,2.3817,0.52,0.4158,0.6242),
        28: (2.0125,1.61,2.415,0.36,0.2733,0.4467),
        29: (2.04,1.6317,2.4483,0.46,0.3683,0.5517),
        30: (2.0675,1.6542,2.4808,0.29,0.2033,0.3767),
        31: (2.095,1.6758,2.5142,0.29,0.2033,0.3767),
    },
    "VAN": {
        1: (1.7375,1.39,2.085,0.11,0.055,0.165),
        2: (1.765,1.4117,2.1183,0.14,0.0842,0.1958),
        3: (1.7925,1.4342,2.1508,0.16,0.0958,0.2242),
        4: (1.82,1.4558,2.1842,0.14,0.0842,0.1958),
        5: (1.8475,1.4783,2.2167,0.14,0.0842,0.1958),
        6: (1.875,1.5,2.25,0.14,0.0842,0.1958),
        7: (1.9025,1.5217,2.2833,0.14,0.0842,0.1958),
        8: (1.93,1.5442,2.3158,0.14,0.0842,0.1958),
        9: (1.9575,1.5658,2.3492,0.14,0.0842,0.1958),
        10: (1.985,1.5883,2.3817,0.14,0.0842,0.1958),
        11: (2.0125,1.61,2.415,0.14,0.0842,0.1958),
        12: (2.04,1.6317,2.4483,0.14,0.0842,0.1958),
        13: (2.0675,1.6542,2.4808,0.16,0.0958,0.2242),
        14: (2.095,1.6758,2.5142,0.14,0.0842,0.1958),
        15: (2.1225,1.6983,2.5467,0.14,0.0842,0.1958),
        16: (2.15,1.72,2.58,0.14,0.0842,0.1958),
        17: (2.1775,1.7417,2.6133,0.16,0.0958,0.2242),
        18: (2.205,1.7642,2.6458,0.22,0.1433,0.2967),
        19: (2.2325,1.7858,2.6792,0.16,0.0958,0.2242),
        20: (2.26,1.8083,2.7117,0.14,0.0842,0.1958),
        21: (2.2875,1.83,2.745,0.11,0.055,0.165),
        22: (2.315,1.8517,2.7783,0.14,0.0842,0.1958),
        23: (2.3425,1.8742,2.8108,0.22,0.1433,0.2967),
        24: (2.37,1.8958,2.8442,0.22,0.1433,0.2967),
        25: (2.3975,1.9183,2.8767,0.22,0.1433,0.2967),
        26: (2.425,1.94,2.91,0.22,0.1433,0.2967),
        27: (2.4525,1.9617,2.9433,0.14,0.0842,0.1958),
        28: (2.48,1.9842,2.9758,0.25,0.175,0.325),
        29: (2.5075,2.0058,3.0092,0.16,0.0958,0.2242),
        30: (2.535,2.0283,3.0417,0.14,0.0842,0.1958),
        31: (2.5625,2.05,3.075,0.16,0.0958,0.2242),
    },
    "ŞANLIURFA": {
        1: (2.095,1.6758,2.5142,0.29,0.2033,0.3767),
        2: (2.1225,1.6983,2.5467,0.29,0.2033,0.3767),
        3: (2.15,1.72,2.58,0.29,0.2033,0.3767),
        4: (2.1775,1.7417,2.6133,0.29,0.2033,0.3767),
        5: (2.205,1.7642,2.6458,0.29,0.2033,0.3767),
        6: (2.2325,1.7858,2.6792,0.29,0.2033,0.3767),
        7: (2.26,1.8083,2.7117,0.29,0.2033,0.3767),
        8: (2.2875,1.83,2.745,0.25,0.175,0.325),
        9: (2.315,1.8517,2.7783,0.25,0.175,0.325),
        10: (2.3425,1.8742,2.8108,0.25,0.175,0.325),
        11: (2.37,1.8958,2.8442,0.29,0.2033,0.3767),
        12: (2.3975,1.9183,2.8767,0.29,0.2033,0.3767),
        13: (2.425,1.94,2.91,0.46,0.3683,0.5517),
        14: (2.4525,1.9617,2.9433,0.36,0.2733,0.4467),
        15: (2.48,1.9842,2.9758,0.36,0.2733,0.4467),
        16: (2.5075,2.0058,3.0092,0.29,0.2033,0.3767),
        17: (2.535,2.0283,3.0417,0.36,0.2733,0.4467),
        18: (2.5625,2.05,3.075,0.52,0.4158,0.6242),
        19: (2.59,2.0717,3.1083,0.46,0.3683,0.5517),
        20: (2.6175,2.0942,3.1408,0.29,0.2033,0.3767),
        21: (2.645,2.1158,3.1742,0.36,0.2733,0.4467),
        22: (2.6725,2.1383,3.2067,0.46,0.3683,0.5517),
        23: (2.7,2.16,3.24,0.52,0.4158,0.6242),
        24: (2.7275,2.1817,3.2733,0.52,0.4158,0.6242),
        25: (2.755,2.2042,3.3058,0.52,0.4158,0.6242),
        26: (2.7825,2.2258,3.3392,0.29,0.2033,0.3767),
        27: (2.81,2.2483,3.3717,0.52,0.4158,0.6242),
        28: (2.8375,2.27,3.405,0.57,0.4558,0.6842),
        29: (2.865,2.2917,3.4383,0.52,0.4158,0.6242),
        30: (2.8925,2.3142,3.4708,0.46,0.3683,0.5517),
        31: (2.92,2.3358,3.5042,0.57,0.4558,0.6842),
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

    oneri = "pro" if tuketim > 20 else "basic"
    oneri_adi = PAKETLER[oneri]["ad"]
    print(f"\n  💡 İpucu: Tüketiminize göre '{oneri_adi}' paketi önerilir.")
    print("\nSistem paketi seçin:")
    print("  1. Helion Basic       — 8 güneş paneli")
    print("  2. Helion Pro (Enterprise) — 10 güneş paneli + 1 rüzgar türbini")
    while True:
        try:
            paket_secim = int(input("\nPaket numarasını seçin (1-2): "))
            if paket_secim in (1, 2):
                paket_key = "basic" if paket_secim == 1 else "pro"
                panel_sayisi   = PAKETLER[paket_key]["panel"]
                turbine_sayisi = PAKETLER[paket_key]["turbine"]
                print(f"  → {PAKETLER[paket_key]['ad']} seçildi: {panel_sayisi} panel, {turbine_sayisi} türbin")
                break
            print("  Hata: 1 veya 2 girin.")
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

    return sehir, gun, tuketim, batarya_yuzde, panel_sayisi, turbine_sayisi, satis_yap


# ==============================================================
# BÖLÜM 3: ÜRETİM HESAPLAMA
# ==============================================================
def uretim_hesapla(sehir, gun, panel_sayisi, turbine_sayisi):
    ges_birim, _, _, res_birim, _, _ = URETIM_VERILERI[sehir][gun]

    # Toplam üretim = birim değer × adet
    ges_ort = ges_birim * panel_sayisi
    res_ort = res_birim * turbine_sayisi

    overheat_panel_sayisi = 0

    # OVER HEAT: doğu şehirlerde %25 ihtimalle panel aşırı ısınması
    if sehir in DOGU_SEHIRLER:
        if random.random() < 0.25:
            overheat_panel_sayisi = random.randint(1, min(3, panel_sayisi))
            kayip_oran = overheat_panel_sayisi / panel_sayisi
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
def ekonomik_analiz(tuketim, grid_kullanim, fazla_enerji, satis_yap, panel_sayisi, turbine_sayisi):
    toplam_maliyet    = (sum(SISTEM_MALIYETI.values())
                         + panel_sayisi   * PANEL_BIRIM_FIYATI
                         + turbine_sayisi * TURBINE_BIRIM_FIYATI)

    fatura_sistemsiz  = round(tuketim * GRID_FIYATI, 2)
    fatura_sistemli   = round(grid_kullanim * GRID_FIYATI, 2)
    satis_geliri      = round(fazla_enerji * SATIS_FIYATI, 2) if satis_yap else 0.0
    gunluk_kazanc     = round(fatura_sistemsiz - fatura_sistemli + satis_geliri, 2)
    aylik_kazanc      = round(gunluk_kazanc * 31, 2)
    aylik_fatura_yeys = round(fatura_sistemli * 31, 2)
    aylik_fatura_yok  = round(fatura_sistemsiz * 31, 2)
    yillik_kazanc     = round(gunluk_kazanc * 365, 2)

    if yillik_kazanc > 0:
        amortisman_yil   = round(toplam_maliyet / yillik_kazanc, 1)
        omur_boyu_kazanc = round(yillik_kazanc * SISTEM_OMRU - toplam_maliyet, 2)
    else:
        amortisman_yil   = None
        omur_boyu_kazanc = round(-toplam_maliyet, 2)

    return (fatura_sistemsiz, fatura_sistemli, satis_geliri, gunluk_kazanc,
            aylik_fatura_yok, aylik_fatura_yeys, aylik_kazanc,
            yillik_kazanc, amortisman_yil, omur_boyu_kazanc, toplam_maliyet)


# ==============================================================
# BÖLÜM 8: RAPOR
# ==============================================================
def senaryo_metni(senaryo_no, satis_yap):
    fazla_hedef = "şebekeye satıldı" if satis_yap else "toprağa verildi"
    metinler = {
        1: f"Üretim tüketimi karşıladı. Batarya doldu. Fazla enerji {fazla_hedef}.",
        2: "Üretim yetersiz kaldı. Batarya kullanıldı, bitti. Açık şebekeden sağlandı.",
        3: "Üretim yetersiz. Batarya bitti. Şebeke karşılayamadı. BLACKOUT oluştu.",
        4: "Üretim tüketimi karşıladı. Kalan enerji bataryaya verildi.",
        5: "Üretim yetersiz. Grid devreye girdi. Kesinti sırasında BLACKOUT oluştu.",
    }
    return metinler.get(senaryo_no, "")


def rapor_goster(sehir, gun, tuketim, batarya_bas, batarya_son,
                 ges, res, toplam_uretim, grid_kullanim, fazla_enerji, satis_yap,
                 panel_sayisi, turbine_sayisi,
                 overheat_panel, kesinti_suresi, kurtarilan_saat, blackout_saat,
                 fatura_sistemsiz, fatura_sistemli, satis_geliri, gunluk_kazanc,
                 aylik_fatura_yok, aylik_fatura_yeys, aylik_kazanc,
                 yillik_kazanc, amortisman_yil, omur_boyu_kazanc, toplam_maliyet, senaryo_no):

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
        print(f"  GES üretimi {overheat_panel}/{panel_sayisi} panel oranında düşürüldü.")
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
    print(f"  {senaryo_metni(senaryo_no, satis_yap)}")

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
    print(f"  Sistem Kurulum Maliyeti  : {toplam_maliyet:,} TL")
    for kalem, tutar in SISTEM_MALIYETI.items():
        print(f"    - {kalem:<18}: {tutar:,} TL")
    print(f"    - {'güneş paneli':<18}: {panel_sayisi} x {PANEL_BIRIM_FIYATI:,} = {panel_sayisi * PANEL_BIRIM_FIYATI:,} TL")
    if turbine_sayisi > 0:
        print(f"    - {'rüzgar türbini':<18}: {turbine_sayisi} x {TURBINE_BIRIM_FIYATI:,} = {turbine_sayisi * TURBINE_BIRIM_FIYATI:,} TL")
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

    # --- ÇEVRESEL ETKİ ---
    aylik_uretim = round(toplam_uretim * 30, 2)
    co2_kg       = round(aylik_uretim * 0.5, 1)
    agac_sayisi  = round(aylik_uretim / 40, 1)

    print("\n" + "=" * 65)
    print("  ÇEVRESEL ETKİ (AYLIK BAZDA)")
    print("=" * 65)
    print(f"  Aylık Yenilenebilir Üretim  : {aylik_uretim:.2f} kWh")
    print(f"  Aylık CO₂ Tasarrufu         : {co2_kg} kg")
    print(f"  Kurtarılan Ağaç Eşdeğeri    : {agac_sayisi} ağaç")
    print("=" * 65)


# ==============================================================
# ANA AKIŞ
# ==============================================================
def main():
    sehir, gun, tuketim, batarya_yuzde, panel_sayisi, turbine_sayisi, satis_yap = veri_al()

    batarya_bas = round(BATARYA_KAPASITESI * batarya_yuzde / 100, 2)

    # Üretimi hesapla (sapma + overheat)
    ges, res, overheat_panel = uretim_hesapla(sehir, gun, panel_sayisi, turbine_sayisi)
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
     yillik_kazanc, amortisman_yil, omur_boyu_kazanc, toplam_maliyet) = ekonomik_analiz(
        tuketim, grid_kullanim, fazla_enerji, satis_yap, panel_sayisi, turbine_sayisi
    )

    # Rapor
    rapor_goster(
        sehir, gun, tuketim, batarya_bas, batarya_son,
        ges, res, toplam_uretim, grid_kullanim, fazla_enerji, satis_yap,
        panel_sayisi, turbine_sayisi,
        overheat_panel, kesinti_suresi, kurtarilan_saat, blackout_saat,
        fatura_sistemsiz, fatura_sistemli, satis_geliri, gunluk_kazanc,
        aylik_fatura_yok, aylik_fatura_yeys, aylik_kazanc,
        yillik_kazanc, amortisman_yil, omur_boyu_kazanc, toplam_maliyet, senaryo_no
    )


main()
