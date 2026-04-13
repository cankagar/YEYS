# GÖREV: ANALİZ & RAPORLAMA (OUTPUT)
# KİŞİ: CAN

def toplam_hesapla(solar, wind):
    # Tüm saatlerin toplam üretimini hesapla
    total_renewable = sum(solar) + sum(wind)
    total_production = total_renewable  # Bu projede tüm üretim yenilenebilir
    return total_production, total_renewable


def yenilenebilir_orani_hesapla(total_renewable, total_production):
    # Yenilenebilir enerji oranını yüzde olarak hesapla
    if total_production == 0:
        return 0
    renewable_ratio = (total_renewable / total_production) * 100
    return renewable_ratio


def rapor_goster(solar, wind, load, battery_history, grid_history, blackout_listesi):
    print("\n" + "=" * 50)
    print("           SİMÜLASYON SONUÇ RAPORU")
    print("=" * 50)

    # Toplam değerleri hesapla
    total_production, total_renewable = toplam_hesapla(solar, wind)
    renewable_ratio = yenilenebilir_orani_hesapla(total_renewable, total_production)
    total_grid_used = sum(grid_history)
    total_load = sum(load)

    # Genel bilgiler
    print(f"\nSimülasyon süresi      : {len(solar)} saat")
    print(f"Toplam üretim          : {total_production:.2f} kWh")
    print(f"Toplam tüketim         : {total_load:.2f} kWh")
    print(f"Toplam yenilenebilir   : {total_renewable:.2f} kWh")
    print(f"Yenilenebilir oranı    : %{renewable_ratio:.1f}")
    print(f"Toplam grid kullanımı  : {total_grid_used:.2f} kWh")
    print(f"Batarya min seviyesi   : {min(battery_history):.2f} kWh")
    print(f"Batarya max seviyesi   : {max(battery_history):.2f} kWh")

    # Sistem durumu
    sistem_stabil = not (True in blackout_listesi)
    if sistem_stabil:
        print("\nSistem durumu          : STABIL ✓")
    else:
        blackout_saatleri = [i + 1 for i, b in enumerate(blackout_listesi) if b]
        print(f"\nSistem durumu          : BLACKOUT OLUŞTU ✗")
        print(f"Blackout saatleri      : {blackout_saatleri}")

    # Saatlik detay tablosu
    print("\n" + "-" * 70)
    print(f"{'Saat':<6} {'Solar':>8} {'Wind':>8} {'Load':>8} {'Üretim':>8} {'Batarya':>10} {'Grid':>8} {'Durum':>10}")
    print("-" * 70)

    for i in range(len(solar)):
        production = solar[i] + wind[i]
        durum = "BLACKOUT" if blackout_listesi[i] else "OK"
        print(f"{i+1:<6} {solar[i]:>8.2f} {wind[i]:>8.2f} {load[i]:>8.2f} {production:>8.2f} {battery_history[i]:>10.2f} {grid_history[i]:>8.2f} {durum:>10}")

    print("-" * 70)
    print("=" * 50)
