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
  const isNotFound = pathname.includes("not-found");
  const isLogin = pathname.includes("login");

  const searchParams = useSearchParams();
  const redirectURL = searchParams.get("redirect");

  if (redirectURL) {
    if (typeof window === "undefined") {
      return;
    } else {
      let reUrl = decodeURIComponent(redirectURL);
      const verifyToken = searchParams.get("verify_token");
      
      if (verifyToken) {
        try {
          // 使用 URL 对象来正确处理查询参数
          const url = new URL(reUrl, window.location.origin);
          url.searchParams.set("verify_token", verifyToken);
          reUrl = url.toString();
        } catch {
          // 如果 URL 解析失败，使用备用方案
          const separator = reUrl.split("#")[0].includes("?") ? "&" : "?";
          const [path, hash] = reUrl.split("#");
          reUrl = hash ? `${path}${separator}verify_token=${verifyToken}#${hash}` : `${path}${separator}verify_token=${verifyToken}`;
        }
      }
      
      const redUrl = reUrl + window?.location?.hash;
      window?.location?.replace(redUrl);
      return;
    }
  }

  if (!isHome && !isLogin && !uuid && !isNotFound) {
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
