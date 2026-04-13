# GÖREV: ANALİZ & RAPORLAMA (OUTPUT)
# KİŞİ: CAN

def rapor_goster(solar, wind, load, battery_history, grid_history, wasted_history, blackout_listesi, grid_price):

    toplam_saat      = len(solar)
    total_load       = sum(load)
    total_renewable  = sum(solar) + sum(wind)
    total_production = total_renewable       # Bu projede tüm üretim yenilenebilir
    total_grid_used  = sum(grid_history)
    total_wasted     = sum(wasted_history)   # Toprağa atılan toplam enerji
    blackout_sayisi  = blackout_listesi.count(True)

    # Yüzde hesaplamaları
    if total_load > 0:
        renewable_ratio = (total_renewable / total_load) * 100
        grid_ratio      = (total_grid_used / total_load) * 100
    else:
        renewable_ratio = 0
        grid_ratio      = 0

    # Maliyet hesabı
    # Hiç yenilenebilir kullanmasaydı tüm tüketimi şebekeden alacaktı
    hypothetical_cost = total_load * grid_price
    # Gerçekte yalnızca grid'den aldığı kadar ödedi
    actual_cost       = total_grid_used * grid_price
    # Yenilenebilir enerji sayesinde kazanılan para
    savings           = hypothetical_cost - actual_cost

    # Sistem stabilitesi
    sistem_stabil = blackout_sayisi == 0

    print("\n" + "=" * 55)
    print("          SİMÜLASYON SONUÇ RAPORU")
    print("=" * 55)

    print(f"\n{'Simülasyon süresi':<30}: {toplam_saat} saat")
    print(f"{'Toplam tüketim':<30}: {total_load:.2f} kWh")
    print(f"{'Toplam üretim (yenilenebilir)':<30}: {total_production:.2f} kWh")
    print(f"{'Toplam grid kullanımı':<30}: {total_grid_used:.2f} kWh")
    print(f"{'Toprağa atılan enerji':<30}: {total_wasted:.2f} kWh")

    print(f"\n{'Yenilenebilir enerji oranı':<30}: %{renewable_ratio:.1f}")
    print(f"{'Şebeke enerji oranı':<30}: %{grid_ratio:.1f}")

    print(f"\n{'Kaç kez blackout oldu':<30}: {blackout_sayisi} kez")
    if sistem_stabil:
        print(f"{'Sistem durumu':<30}: STABIL ✓")
    else:
        blackout_saatleri = [i + 1 for i, b in enumerate(blackout_listesi) if b]
        print(f"{'Sistem durumu':<30}: BLACKOUT OLUŞTU ✗")
        print(f"{'Blackout saatleri':<30}: {blackout_saatleri}")

    # Maliyet raporu
    print("\n" + "-" * 55)
    print("  MALİYET ANALİZİ")
    print("-" * 55)
    print(f"{'Şebeke birim fiyatı':<30}: {grid_price:.2f} TL/kWh")
    print(f"{'Gerçek fatura (grid maliyeti)':<30}: {actual_cost:.2f} TL")
    print(f"{'Hiç yenilenebilir olmasaydı':<30}: {hypothetical_cost:.2f} TL")
    print(f"{'Yenilenebilir enerjiden kazanç':<30}: {savings:.2f} TL")

    # Saatlik detay tablosu
    print("\n" + "-" * 85)
    print(f"{'Saat':<5} {'Solar':>7} {'Wind':>7} {'Load':>7} {'Üretim':>7} {'Batarya':>9} {'Grid':>7} {'Toprak':>8} {'Durum':>10}")
    print("-" * 85)

    for i in range(toplam_saat):
        production = solar[i] + wind[i]
        durum = "BLACKOUT" if blackout_listesi[i] else "OK"
        print(
            f"{i+1:<5} {solar[i]:>7.2f} {wind[i]:>7.2f} {load[i]:>7.2f} "
            f"{production:>7.2f} {battery_history[i]:>9.2f} {grid_history[i]:>7.2f} "
            f"{wasted_history[i]:>8.2f} {durum:>10}"
        )

    print("-" * 85)
    print("=" * 55)
