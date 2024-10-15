import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
});

const validRoutes = ['home', 'club', 'service', 'events', 'shipping', 'info', 'mart', 'ticket'];

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const validLocales = ['en', 'zh'];

  // 处理根路径
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en/home', request.url));
  }

  const [, locale, ...rest] = pathname.split('/');
  const restPath = rest.join('/');

  // 处理无效的语言路径
  if (!validLocales.includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // 处理 /en 或 /zh 路径
  if (restPath === '') {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  // 处理无效路径，但排除 not-found 路由
  if (!validRoutes.includes(rest[0]) && rest[0] !== 'not-found') {
    console.log(`Rewriting to not-found: ${pathname}`);
    return NextResponse.redirect(new URL(`/${locale}/not-found`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|public|images|icons|favicon.ico).*)'],
};