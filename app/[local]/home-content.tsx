"use client";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { usePathname } from "@/app/navigation";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

export default function HomeContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const uuid = useAtomValue(UuidAtom);
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isLogin = pathname === "/login";
  const router = useRouter();
  const locale = useLocale();

  const searchParams = useSearchParams();

  const redirectURL = searchParams.get("redirect");

  if (redirectURL) {
    const reUrl = redirectURL + window.location.hash;
    window.location.replace(reUrl);
    return;
  }

  if (!isHome && !uuid && !isLogin) {
    const simpPath = pathname.replace("/", "");
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

    const path = `/${locale}/login${searchQuery}`;
    router.push(path);
    return;
  }

  return (
    <div className="right-block content-container md:min-h-unset relative min-h-[200.0025px]">
      {children}
    </div>
  );
}
