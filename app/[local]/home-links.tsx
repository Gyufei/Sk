"use client";
import Image from "next/image";
import { useRouter } from "@/app/navigation";
import { UuidAtom } from "@/lib/api/state";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils/utils";
import { useMemo } from "react";
import { useFullPath } from "@/lib/use-full-path";
import { isProduction } from "@/lib/api/path";

const walletsLink = {
  id: "wallets",
  pathname: "/wallets",
  href: "/wallets",
  name: "Wallets",
  src: "/icons/wallets.svg",
};

export default function HomeLinks() {
  const uuid = useAtomValue(UuidAtom);
  const pathname = useFullPath();
  const router = useRouter();

  const isJuu17Home = pathname === "/";
  const isOneHome = pathname.startsWith("/one");
  const isBrands = pathname.startsWith("/brands");

  const homeLinks = useMemo(() => {
    if (isBrands) {
      return [
        {
          id: "mart",
          pathname: "/mart",
          href: "/mart",
          name: "Mart",
        },
        {
          id: "club",
          pathname: "/club",
          href: "/club",
          name: "Dashboard",
        },
        {
          id: "one",
          pathname: isProduction ? "https://one.juu17.com" : "/one",
          href: isProduction ? "https://one.juu17.com" : "/one",
          name: "One",
        },
      ];
    }
    return [];
  }, [isBrands]);

  if (isJuu17Home || isOneHome) {
    return null;
  }

  function isPathActive(href: string): boolean {
    return pathname.startsWith(href);
  }

  return (
    <ul className="navbar relative w-full sm:static sm:w-fit">
      {uuid && isBrands && (
        <li
          className={cn(
            isPathActive(walletsLink.href) && "active",
            "absolute right-0 top-0 font-haasDisp sm:static",
          )}
          data-id={walletsLink.id}
          onClick={() => router.push(walletsLink.href)}
        >
          <Image
            className="my-[5px]"
            src={walletsLink.src}
            width={40}
            height={40}
            alt=""
          />
        </li>
      )}
      {homeLinks.map((item) => (
        <li
          key={item.name}
          className={cn(isPathActive(item.href) && "active", "font-haasDisp")}
          data-id={item.id}
          onClick={() => router.push(item.href)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
