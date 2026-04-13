# GÖREV: GRID & BLACKOUT SİSTEMİ
# KİŞİ: YAVUZ

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
