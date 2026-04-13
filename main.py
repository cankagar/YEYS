# ANA PROGRAM - Tüm modülleri birleştirir ve simülasyonu çalıştırır

from hesaplama import saatlik_hesapla
from batarya import batarya_isle
from grid import grid_kullan
from rapor import rapor_goster

# ─── HAZIR VERİLER ───────────────────────────────────────────────
solar            = [0, 2, 5, 7, 6, 4, 1, 0]   # Her saat güneş üretimi (kWh)
wind             = [1, 1, 2, 2, 3, 2, 1, 1]   # Her saat rüzgar üretimi (kWh)
load             = [3, 4, 4, 5, 6, 5, 4, 3]   # Her saat tüketim (kWh)
battery_capacity = 10                          # Batarya maksimum kapasitesi (kWh)
battery          = 5                           # Bataryanın başlangıç seviyesi (kWh)
grid_limit       = 3                           # Grid'den alınabilecek max enerji (kWh), 0 = sınırsız
# ─────────────────────────────────────────────────────────────────


def simulasyon_calistir(solar, wind, load, battery, battery_capacity, grid_limit):
    # Simülasyon boyunca saatlik verileri tutacak listeler
    battery_history = []
    grid_history = []
    blackout_listesi = []

    # Üretim ve denge değerlerini hesapla
    uretim_listesi, denge_listesi = saatlik_hesapla(solar, wind, load)

    print("\nSimülasyon başlıyor...")

    # Her saat için simülasyonu adım adım işle
    for i in range(len(solar)):
        balance = denge_listesi[i]

        # Bataryayı güncelle ve kalan açığı al
        battery, kalan_acik = batarya_isle(battery, balance, battery_capacity)

        # Kalan açık varsa grid'den karşılamaya çalış
        grid_used, blackout = grid_kullan(kalan_acik, grid_limit)

        # Bu saatin sonuçlarını kaydet
        battery_history.append(battery)
        grid_history.append(grid_used)
        blackout_listesi.append(blackout)

    return battery_history, grid_history, blackout_listesi


def main():
    # 1. Simülasyonu çalıştır
    battery_history, grid_history, blackout_listesi = simulasyon_calistir(
        solar, wind, load, battery, battery_capacity, grid_limit
    )

    # 3. Sonuçları raporla
    rapor_goster(solar, wind, load, battery_history, grid_history, blackout_listesi)


# Programı başlat
main()
