import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Eğer kullanıcı zaten '/' yolundaysa yönlendirme yapma (sonsuz döngüyü engeller)
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Kullanıcıyı ana sayfaya yönlendir
  return NextResponse.redirect(new URL('/', request.url))
}

// Hangi yolların middleware tarafından kontrol edileceğini belirle
export const config = {
  matcher: [
    /*
     * Aşağıdakiler HARİÇ tüm istek yollarını yakalar:
     * - api (API rotaları)
     * - _next/static (statik dosyalar)
     * - _next/image (resim optimizasyon dosyaları)
     * - favicon.ico
     * - public klasöründeki statik dosyalar (png, jpg, svg, vb.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif)).*)',
  ],
}