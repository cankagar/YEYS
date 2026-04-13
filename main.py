# ANA PROGRAM - Tüm modülleri birleştirir ve simülasyonu çalıştırır

from giris import veri_al
from hesaplama import saatlik_hesapla
from batarya import batarya_isle
from grid import grid_kullan
from rapor import rapor_goster


def simulasyon_calistir(solar, wind, load, grid_available, battery, battery_capacity, grid_limit):
    # Simülasyon boyunca saatlik verileri tutacak listeler
    battery_history  = []
    grid_history     = []
    wasted_history   = []   # Her saat toprağa atılan enerji
    blackout_listesi = []

    # Üretim ve denge değerlerini hesapla
    _, denge_listesi = saatlik_hesapla(solar, wind, load)

    print("\nSimülasyon başlıyor...")

    # Her saat için simülasyonu adım adım işle
    for i in range(len(solar)):
        balance = denge_listesi[i]

        # Bataryayı güncelle; kalan açığı ve toprağa atılan enerjiyi al
        battery, kalan_acik, wasted = batarya_isle(battery, balance, battery_capacity)

        # Kalan açık varsa ve şebeke durumuna göre grid'den karşıla
        grid_used, blackout = grid_kullan(kalan_acik, grid_limit, grid_available[i])

        # Bu saatin sonuçlarını kaydet
        battery_history.append(battery)
        grid_history.append(grid_used)
        wasted_history.append(wasted)
        blackout_listesi.append(blackout)

    return battery_history, grid_history, wasted_history, blackout_listesi


def main():
    # 1. Kullanıcıdan verileri al
    solar, wind, load, grid_available, battery, battery_capacity, grid_limit, grid_price = veri_al()

    # 2. Simülasyonu çalıştır
    battery_history, grid_history, wasted_history, blackout_listesi = simulasyon_calistir(
        solar, wind, load, grid_available, battery, battery_capacity, grid_limit
    )

    # 3. Sonuçları raporla
    rapor_goster(solar, wind, load, battery_history, grid_history, wasted_history, blackout_listesi, grid_price)


# Programı başlat
main()
