# ANA PROGRAM - Tüm modülleri birleştirir ve simülasyonu çalıştırır


# ===========================================================
# BÖLÜM 1: GİRİŞ SİSTEMİ (INPUT & VERİ YÖNETİMİ)
# KİŞİ: TALHA
# ===========================================================

def veri_al():
    print("=== ENERJİ SİMÜLASYONU - VERİ GİRİŞİ ===\n")

    # Kaç saatlik simülasyon yapılacak?
    while True:
        try:
            saat_sayisi = int(input("Kaç saatlik simülasyon yapmak istiyorsunuz? "))
            if saat_sayisi <= 0:
                print("Hata: Saat sayısı 0'dan büyük olmalıdır.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen geçerli bir sayı girin.")

    # Güneş üretim verilerini kullanıcıdan al
    print(f"\nGüneş üretim verilerini girin ({saat_sayisi} değer, boşlukla ayırın):")
    while True:
        try:
            solar = list(map(float, input("Solar (kWh): ").split()))
            if len(solar) != saat_sayisi:
                print(f"Hata: {saat_sayisi} değer girmelisiniz, {len(solar)} girdiniz.")
                continue
            if any(x < 0 for x in solar):
                print("Hata: Negatif değer girilemez.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen sayısal değerler girin.")

    # Rüzgar üretim verilerini kullanıcıdan al
    print(f"\nRüzgar üretim verilerini girin ({saat_sayisi} değer, boşlukla ayırın):")
    while True:
        try:
            wind = list(map(float, input("Wind (kWh): ").split()))
            if len(wind) != saat_sayisi:
                print(f"Hata: {saat_sayisi} değer girmelisiniz, {len(wind)} girdiniz.")
                continue
            if any(x < 0 for x in wind):
                print("Hata: Negatif değer girilemez.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen sayısal değerler girin.")

    # Her saat için evdeki toplam elektrik tüketimini al
    print(f"\nSaatlik elektrik tüketimini girin ({saat_sayisi} değer, boşlukla ayırın):")
    while True:
        try:
            load = list(map(float, input("Load (kWh): ").split()))
            if len(load) != saat_sayisi:
                print(f"Hata: {saat_sayisi} değer girmelisiniz, {len(load)} girdiniz.")
                continue
            if any(x < 0 for x in load):
                print("Hata: Negatif değer girilemez.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen sayısal değerler girin.")

    # Her saat için şebeke elektriği var mı? (1 = var, 0 = yok)
    print(f"\nHer saat için şebeke elektriği durumunu girin ({saat_sayisi} değer, 1=var 0=yok):")
    while True:
        try:
            grid_available_raw = list(map(int, input("Şebeke (1/0): ").split()))
            if len(grid_available_raw) != saat_sayisi:
                print(f"Hata: {saat_sayisi} değer girmelisiniz, {len(grid_available_raw)} girdiniz.")
                continue
            if any(x not in [0, 1] for x in grid_available_raw):
                print("Hata: Yalnızca 0 veya 1 girebilirsiniz.")
                continue
            # 1 → True, 0 → False olarak dönüştür
            grid_available = [x == 1 for x in grid_available_raw]
            break
        except ValueError:
            print("Hata: Lütfen 0 veya 1 girin.")

    # Batarya kapasitesini al
    while True:
        try:
            battery_capacity = float(input("\nBatarya kapasitesi (kWh): "))
            if battery_capacity <= 0:
                print("Hata: Batarya kapasitesi 0'dan büyük olmalıdır.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen geçerli bir sayı girin.")

    # Bataryanın başlangıç seviyesini al
    while True:
        try:
            battery = float(input(f"Bataryanın başlangıç seviyesi (0 - {battery_capacity} kWh): "))
            if battery < 0 or battery > battery_capacity:
                print(f"Hata: Değer 0 ile {battery_capacity} arasında olmalıdır.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen geçerli bir sayı girin.")

    # Grid limitini al
    while True:
        try:
            grid_limit = float(input("\nGrid limiti (kWh, 0 = limit yok): "))
            if grid_limit < 0:
                print("Hata: Grid limiti negatif olamaz.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen geçerli bir sayı girin.")

    # Eğer grid limiti 0 girilirse sınırsız kabul et
    if grid_limit == 0:
        grid_limit = float('inf')

    # Şebekeden alınan elektriğin kWh birim fiyatını al
    while True:
        try:
            grid_price = float(input("Şebeke elektriği birim fiyatı (TL/kWh): "))
            if grid_price < 0:
                print("Hata: Fiyat negatif olamaz.")
                continue
            break
        except ValueError:
            print("Hata: Lütfen geçerli bir sayı girin.")

    return solar, wind, load, grid_available, battery, battery_capacity, grid_limit, grid_price


# ===========================================================
# BÖLÜM 2: ENERJİ HESAPLAMA
# KİŞİ: ALİ
# ===========================================================

def uretim_hesapla(solar_value, wind_value):
    # Güneş ve rüzgar üretimini toplayarak toplam üretimi döndür
    production = solar_value + wind_value
    return production


def denge_hesapla(production, load_value):
    # Üretimden tüketimi çıkar
    # Pozitif: fazla enerji var → bataryaya gider
    # Negatif: açık var → batarya veya gridden karşılanır
    balance = production - load_value
    return balance


def saatlik_hesapla(solar, wind, load):
    # Her saat için üretim ve denge değerlerini hesapla ve listelere kaydet
    uretim_listesi = []
    denge_listesi = []

    for i in range(len(solar)):
        production = uretim_hesapla(solar[i], wind[i])
        balance = denge_hesapla(production, load[i])

        uretim_listesi.append(production)
        denge_listesi.append(balance)

    return uretim_listesi, denge_listesi


# ===========================================================
# BÖLÜM 3: BATARYA YÖNETİMİ
# KİŞİ: BURAK
# ===========================================================

def batarya_doldur(battery, balance, battery_capacity):
    wasted = 0  # Toprağa atılan fazlalık enerji

    battery = battery + balance

    # Batarya kapasiteyi aştıysa fazlalık toprağa atılır
    if battery > battery_capacity:
        wasted = battery - battery_capacity
        battery = battery_capacity  # Batarya maksimuma sabitlenir

    return battery, wasted


def batarya_bos_et(battery, deficit):
    # Enerji açığını bataryadan karşılamaya çalış
    if battery >= deficit:
        battery = battery - deficit
        kalan_acik = 0  # Açık tamamen kapandı
    else:
        # Batarya yetmiyor, kalan açık hesapla
        kalan_acik = deficit - battery
        battery = 0  # Batarya tamamen boşaldı

    return battery, kalan_acik


def batarya_isle(battery, balance, battery_capacity):
    # Denge pozitifse bataryayı doldur, negatifse boşalt
    # NOT: Batarya YALNIZCA yenilenebilir enerji fazlasında (balance > 0) dolar.
    # balance = üretim - tüketim olduğundan, grid buraya dahil değildir.
    kalan_acik = 0
    wasted = 0

    if balance >= 0:
        # Yenilenebilir enerji fazlası var → bataryaya ekle, sığmazsa toprağa at
        battery, wasted = batarya_doldur(battery, balance, battery_capacity)
    else:
        # Enerji açığı var → deficit pozitif sayı olarak alınır
        deficit = abs(balance)
        battery, kalan_acik = batarya_bos_et(battery, deficit)

    return battery, kalan_acik, wasted


# ===========================================================
# BÖLÜM 4: GRID & BLACKOUT SİSTEMİ
# KİŞİ: YAVUZ
# ===========================================================

def grid_kullan(kalan_acik, grid_limit, grid_available):
    grid_used = 0
    blackout = False

    # Enerji açığı yoksa yapılacak bir şey yok
    if kalan_acik == 0:
        return grid_used, blackout

    # Şebeke elektriği yoksa direkt blackout
    if not grid_available:
        blackout = True
        return grid_used, blackout

    # Şebeke var, limit yetiyorsa açığı kapat
    if kalan_acik <= grid_limit:
        grid_used = kalan_acik
    else:
        # Grid limiti de yetmiyor → blackout
        blackout = True

    return grid_used, blackout


# ===========================================================
# BÖLÜM 5: ANALİZ & RAPORLAMA (OUTPUT)
# KİŞİ: CAN
# ===========================================================

def rapor_goster(solar, wind, load, battery_baslangic, battery_capacity, battery_history, grid_history, wasted_history, blackout_listesi, grid_price):

    toplam_saat     = len(solar)
    total_load      = sum(load)
    total_grid_used = sum(grid_history)
    total_wasted    = sum(wasted_history)   # Toprağa atılan toplam enerji
    blackout_sayisi = blackout_listesi.count(True)

    # Tüketimin kaynağı: grid dışında kalan her şey yenilenebilir kaynaklıdır
    renewable_consumed = total_load - total_grid_used
    if renewable_consumed < 0:
        renewable_consumed = 0

    # Batarya karşılaştırması
    battery_son      = battery_history[-1]
    battery_degisim  = battery_son - battery_baslangic   # + ise doldu, - ise boşaldı
    battery_son_yuzde = (battery_son / battery_capacity) * 100
    battery_bas_yuzde = (battery_baslangic / battery_capacity) * 100

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
    print(f"{'Toprağa atılan enerji':<30}: {total_wasted:.2f} kWh")

    # Tüketimin kaynağı yüzdeleri
    if total_load > 0:
        renewable_yuzde = (renewable_consumed / total_load) * 100
        grid_yuzde      = (total_grid_used / total_load) * 100
    else:
        renewable_yuzde = 0
        grid_yuzde      = 0

    print(f"\n--- Tüketimin Kaynağı ---")
    print(f"{'  Yenilenebilir kaynaklı':<30}: {renewable_consumed:.2f} kWh  (%{renewable_yuzde:.1f})")
    print(f"{'  Şebekeden gelen':<30}: {total_grid_used:.2f} kWh  (%{grid_yuzde:.1f})")

    # Batarya karşılaştırması
    print(f"\n--- Batarya Durumu ---")
    print(f"{'  Başlangıç seviyesi':<30}: {battery_baslangic:.2f} kWh  (%{battery_bas_yuzde:.1f})")
    print(f"{'  Son seviye':<30}: {battery_son:.2f} kWh  (%{battery_son_yuzde:.1f})")
    if battery_degisim >= 0:
        print(f"{'  Değişim':<30}: +{battery_degisim:.2f} kWh  (doldu)")
    else:
        print(f"{'  Değişim':<30}: {battery_degisim:.2f} kWh  (boşaldı)")

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
    print("\n" + "-" * 96)
    print(f"{'Saat':<5} {'Solar':>7} {'Wind':>7} {'Üretim':>7} {'Batarya':>9} {'Grid':>7} {'Toprak':>8} {'Durum':>10} {'Tüketim':>9}")
    print("-" * 96)

    for i in range(toplam_saat):
        production = solar[i] + wind[i]
        durum = "BLACKOUT" if blackout_listesi[i] else "OK"
        print(
            f"{i+1:<5} {solar[i]:>7.2f} {wind[i]:>7.2f} {production:>7.2f} "
            f"{battery_history[i]:>9.2f} {grid_history[i]:>7.2f} "
            f"{wasted_history[i]:>8.2f} {durum:>10} {load[i]:>9.2f}"
        )

    print("-" * 96)
    print("=" * 55)


# ===========================================================
# ANA AKIŞ
# ===========================================================

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

    # Başlangıç batarya seviyesini rapor için saklıyoruz (simülasyon battery'yi değiştirir)
    battery_baslangic = battery

    # 2. Simülasyonu çalıştır
    battery_history, grid_history, wasted_history, blackout_listesi = simulasyon_calistir(
        solar, wind, load, grid_available, battery, battery_capacity, grid_limit
    )

    # 3. Sonuçları raporla
    rapor_goster(solar, wind, load, battery_baslangic, battery_capacity, battery_history, grid_history, wasted_history, blackout_listesi, grid_price)


# Programı başlat
main()
