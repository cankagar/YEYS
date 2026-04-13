# GÖREV: BATARYA YÖNETİMİ
# KİŞİ: BURAK

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
    kalan_acik = 0
    wasted = 0

    if balance >= 0:
        # Fazla enerji var → bataryaya ekle, sığmazsa toprağa at
        battery, wasted = batarya_doldur(battery, balance, battery_capacity)
    else:
        # Enerji açığı var → deficit pozitif sayı olarak alınır
        deficit = abs(balance)
        battery, kalan_acik = batarya_bos_et(battery, deficit)

    return battery, kalan_acik, wasted
