# GÖREV: ENERJİ HESAPLAMA
# KİŞİ: ALİ

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
