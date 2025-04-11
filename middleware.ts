import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProduction } from "./lib/api/path";

const intlMiddleware = createMiddleware({
  locales: ["en", "zh"],
  defaultLocale: "en",
});

const validRoutes = [
  "login",
  "brands",
  "club",
  "mart",
  "service",
  "wallets",
] as const;

const validLocales = ["en", "zh"] as const;

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

  const checkIsFilePath = (path: string) => {
    const isFilePath = path.includes(".") && path.split(".").pop() !== "";
    return isFilePath;
  };

  if (checkIsFilePath(pathname)) {
    return NextResponse.next();
  }

  const [, locale, ...rest] = pathname.split("/");

  const host = request.nextUrl.hostname;
  const restPath = rest.join("/");

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${searchStr}`, request.url),
    );
  }

  // 处理无效的语言
  if (!validLocales.includes(locale as (typeof validLocales)[number])) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}${searchStr}`, request.url),
    );
  }

  if (!isProduction) {
    if (["club", "mart", "wallets", "login"].includes(rest[0])) {
      return NextResponse.redirect(
        new URL(`/${locale}/brands/${restPath}${searchStr}`, request.url),
      );
    }

    if (
      rest[0] &&
      !["brands", "one"].includes(rest[0]) &&
      rest[0] !== "not-found"
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/not-found`, request.url),
      );
    }

    if (
      rest[0] === "brands" &&
      rest[1] &&
      !["club", "mart", "wallets", "login"].includes(rest[1]) &&
      rest[1] !== "not-found"
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/brands/not-found`, request.url),
      );
    }

    if (rest[0] === "one" && rest[1] && rest[1] !== "not-found") {
      return NextResponse.redirect(
        new URL(`/${locale}/one/not-found`, request.url),
      );
    }
  }

  if (host === "juu17.com") {
    if (rest[0] === "home" && !rest[1]) {
      return NextResponse.redirect(
        new URL(`/${locale}${searchStr}`, "https://brands.juu17.com"),
      );
    } else if (rest[0] === "club") {
      return NextResponse.redirect(
        new URL(
          `/${locale}/${restPath}${searchStr}`,
          "https://brands.juu17.com",
        ),
      );
    } else if (rest[0] && rest[0] !== "not-found") {
      return NextResponse.redirect(
        new URL(`/${locale}/not-found`, request.url),
      );
    }
  }

  if (host === "brands.juu17.com") {
    if (
      rest[0] &&
      !validRoutes.includes(rest[0] as (typeof validRoutes)[number]) &&
      rest[0] !== "not-found"
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/not-found`, request.url),
      );
    }
  }

  if (host === "one.juu17.com") {
    if (rest[0] && rest[0] !== "not-found") {
      return NextResponse.redirect(
        new URL(`/${locale}/not-found`, request.url),
      );
    }
  }

  try {
    return intlMiddleware(request);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next|public|images|icons|favicon.ico).*)"],
};
