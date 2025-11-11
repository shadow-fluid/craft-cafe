import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Negotiator from 'negotiator';
import { config as appConfig } from '@lib/config'

interface ILocale {
  locales: string[]
}

async function getLocale(request: NextRequest, locale: ILocale): Promise<string> {
  // 1. Проверяем cookies
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  if (cookieLocale && locale.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Проверяем Accept-Language
  const headers = Object.fromEntries(request.headers.entries());
  const negotiator = new Negotiator({ headers });
  const userLanguages = negotiator.languages();

  // 3. Определяем регион на основе первого предпочтительного языка
  const primaryLanguage = userLanguages[0] || 'en';
  return primaryLanguage
}

export async function proxy(request: NextRequest) {
  const res = await fetch(`${appConfig.apiBaseUrl}/api/locale`)
  
  if (res.ok) {
    const locale: ILocale = await res.json()
    const currentLocale = await getLocale(request, locale);
    
    // Проверяем поддержку выбранного языка
    const isLocalizationSupported  = locale.locales.includes(currentLocale)
    if (!isLocalizationSupported) return NextResponse.next();
    
    const response = NextResponse.next();
    response.headers.set('x-locale', currentLocale);
    
    // Устанавливаем cookie, если его нет
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    if (!cookieLocale) {
      response.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        sameSite: 'strict',
        maxAge: 31536000, // 1 год
      });
    }
    
    return response;
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};