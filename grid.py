# GÖREV: GRID & BLACKOUT SİSTEMİ
# KİŞİ: YAVUZ

def grid_kullan(kalan_acik, grid_limit):
    # Batarya yetmediyse şebekeden enerji almaya çalış
    grid_used = 0
    blackout = False

    if kalan_acik > 0:
        # Grid limiti yetiyorsa açığı grid ile kapat
        if kalan_acik <= grid_limit:
            grid_used = kalan_acik
        else:
            # Grid de yetmiyor → sistem çöküyor (blackout)
            blackout = True
            grid_used = 0  # Blackout durumunda grid kullanımı sıfırlanır

    return grid_used, blackout


def blackout_kontrol(blackout_listesi):
    # Herhangi bir saatte blackout olduysa True döndür
    if True in blackout_listesi:
        return True
    return False
