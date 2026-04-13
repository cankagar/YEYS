# GÖREV: BATARYA YÖNETİMİ
# KİŞİ: BURAK

def batarya_guncelle(battery, balance, battery_capacity):
    # Eğer denge pozitifse (üretim > tüketim), fazla enerji bataryaya eklenir
    if balance > 0:
        battery = battery + balance

        # Batarya kapasitesi aşılırsa maksimuma sabitle
        if battery > battery_capacity:
            battery = battery_capacity

    return battery


def batarya_bos_et(battery, deficit):
    # Enerji açığını bataryadan karşılamaya çalış
    # Batarya açığı tam karşılıyorsa düş
    if battery >= deficit:
        battery = battery - deficit
        kalan_acik = 0  # Açık tamamen kapandı
    else:
        # Batarya yetmiyor, ne kadar kaldıysa kullan, kalan açık hesapla
        kalan_acik = deficit - battery
        battery = 0  # Batarya tamamen boşaldı

    return battery, kalan_acik


def batarya_isle(battery, balance, battery_capacity):
    # Bu fonksiyon hem doldurmayı hem de boşaltmayı yönetir
    kalan_acik = 0

    if balance >= 0:
        # Fazla enerji var, bataryayı doldur
        battery = batarya_guncelle(battery, balance, battery_capacity)
    else:
        # Enerji açığı var, deficit pozitif sayı olarak alınır
        deficit = abs(balance)
        battery, kalan_acik = batarya_bos_et(battery, deficit)

    return battery, kalan_acik
