# GÖREV: GİRİŞ SİSTEMİ (INPUT & VERİ YÖNETİMİ)
# KİŞİ: TALHA

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
