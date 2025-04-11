"use client";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useFullPath } from "@/lib/use-full-path";
import { usePathname } from "../navigation";

export default function HomeContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale();
  const uuid = useAtomValue(UuidAtom);
  const originPathname = usePathname();
  const pathname = useFullPath();
  const isHome = pathname === "/" || pathname.includes("/one");
  const isLogin = pathname.includes("login");

  const searchParams = useSearchParams();
  const redirectURL = searchParams.get("redirect");

  if (redirectURL) {
    if (typeof window === "undefined") {
      return;
    } else {
      const reUrl = redirectURL + window?.location?.hash;
      window?.location?.replace(reUrl);
      return;
    }
  }

  if (!isHome && !isLogin && !uuid) {
    const simpPath = originPathname.replace("/", "");
    const from = ["not-found", "login"].includes(simpPath) ? "" : simpPath;
    const searchStr =
      searchParams.toString().length > 0 ? `${searchParams.toString()}` : "";
    const hash = window.location.hash;

    let searchQuery = "";
    if (from) {
      searchQuery = `?from=${from}`;

      if (searchStr) {
        searchQuery += `&${searchStr}`;
      }
    } else {
      if (searchStr) {
        searchQuery = `?${searchStr}`;
      }
    }

    if (hash) {
      searchQuery += `${hash}`;
    }

    const path = `/${locale || "en"}/login${searchQuery}`;
    router.push(path);
    return;
  }

  return (
    <div className="right-block content-container md:min-h-unset relative min-h-[200.0025px]">
      {children}
    </div>
  );
}
