"use client";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { usePathname, useRouter } from "@/app/navigation";
import { useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();

  const redirectURL = searchParams.get("redirect");

  if (redirectURL) {
    const reUrl = redirectURL + window.location.hash;
    window.location.replace(reUrl);
    return;
  }

  if (!isHome && !uuid && !isLogin) {
    const from = pathname.replace("/", "");
    const searchStr =
      searchParams.toString().length > 0 ? `&${searchParams.toString()}` : "";
    const hash = window.location.hash;

    const path = `/login?from=${from}${searchStr}${hash}`;
    router.push(path);
    return;
  }

  return (
    <div className="right-block content-container md:min-h-unset relative min-h-[200.0025px]">
      {children}
    </div>
  );
}
