import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "zh"],
  defaultLocale: "en",
});

const validRoutes = ["login", "home", "club", "mart", "service", "wallets"];

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const searchStr =
    searchParams.toString().length > 0 ? `?${searchParams.toString()}` : "";

  const validLocales = ["en", "zh"];
  // 获取用户的首选语言
  const preferredLanguage =
    request.headers.get("accept-language")?.split(",")[0] || "en";
  const defaultLocale = ["zh-CN", "zh"].includes(preferredLanguage)
    ? "zh"
    : "en";

  // 处理根路径
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/home`, request.url),
    );
  }

  const checkIsFilePath = (path: string) => {
    const isFilePath = path.includes(".") && path.split(".").pop() !== "";
    return isFilePath;
  };

  if (checkIsFilePath(pathname)) {
    return NextResponse.next();
  }

  const [, locale, ...rest] = pathname.split("/");
  const restPath = rest.join("/");

  // 处理无效的语言路径
  if (!validLocales.includes(locale)) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}${searchStr}`, request.url),
    );
  }

  // 处理 /en 或 /zh 路径
  if (restPath === "") {
    return NextResponse.redirect(
      new URL(`/${locale}/home${searchStr}`, request.url),
    );
  }

  // 处理无效路径，但排除 not-found 路由
  if (!validRoutes.includes(rest[0]) && rest[0] !== "not-found") {
    return NextResponse.redirect(new URL(`/${locale}/not-found`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|public|images|icons|favicon.ico).*)"],
};
