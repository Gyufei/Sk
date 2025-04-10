import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "zh"],
  defaultLocale: "en",
});

const validRoutes = [
  "login",
  "one",
  "brands",
  "club",
  "mart",
  "service",
  "wallets",
] as const;

const validLocales = ["en", "zh"] as const;

const redirectToOne = ["home"] as const;
const redirectToBrandRoutes = ["club", "mart", "wallets"] as const;

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const searchStr = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  // 获取用户的首选语言
  const preferredLanguage =
    request.headers.get("accept-language")?.split(",")[0] || "en";
  const defaultLocale = ["zh-CN", "zh"].includes(preferredLanguage)
    ? "zh"
    : "en";

  // 处理根路径
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}/one`, request.url));
  }

  const [, locale, ...rest] = pathname.split("/");

  // 处理无效的语言路径
  if (!validLocales.includes(locale as (typeof validLocales)[number])) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}${searchStr}`, request.url),
    );
  }

  // 处理 /en 或 /zh 路径
  if (!rest.length) {
    return NextResponse.redirect(
      new URL(`/${locale}/one${searchStr}`, request.url),
    );
  }

  // 处理无效路径，但排除 not-found 路由
  if (
    !validRoutes.includes(rest[0] as (typeof validRoutes)[number]) &&
    rest[0] !== "not-found"
  ) {
    return NextResponse.redirect(new URL(`/${locale}/not-found`, request.url));
  }

  if (redirectToOne.includes(rest[0] as (typeof redirectToOne)[number])) {
    return NextResponse.redirect(
      new URL(`/${locale}/one${searchStr}`, request.url),
    );
  }

  if (
    redirectToBrandRoutes.includes(
      rest[0] as (typeof redirectToBrandRoutes)[number],
    )
  ) {
    const restPath = rest.join("/");
    return NextResponse.redirect(
      new URL(`/${locale}/brands/${restPath}${searchStr}`, request.url),
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|public|images|icons|favicon.ico).*)"],
};
