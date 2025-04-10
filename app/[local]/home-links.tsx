"use client";
import Image from "next/image";
import { usePathname, useRouter } from "@/app/navigation";
import { UuidAtom } from "@/lib/api/state";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils/utils";
import { useMemo } from "react";

const walletsLink = {
  id: "wallets",
  pathname: "/brands/wallets",
  href: "/brands/wallets",
  name: "Wallets",
  src: "/icons/wallets.svg",
};

export default function HomeLinks() {
  const uuid = useAtomValue(UuidAtom);
  const pathname = usePathname();
  const router = useRouter();

  const isHome =
    pathname === "/" ||
    pathname.startsWith("/one") ||
    pathname.startsWith("/login");
  const isBrands = pathname.startsWith("/brands");

  const homeLinks = useMemo(() => {
    if (isHome || !uuid) {
      return [
        { id: "one", pathname: "/one", href: "/one", name: "One" },
        {
          id: "brands",
          pathname: "/brands",
          href: "/brands",
          name: "Brands",
        },
      ];
    } else {
      return [
        {
          id: "mart",
          pathname: "/brands/mart",
          href: "/brands/mart",
          name: "Mart",
        },
        {
          id: "club",
          pathname: "/brands/club",
          href: "/brands/club",
          name: "Club",
        },
        { id: "one", pathname: "/one", href: "/one", name: "One" },
      ];
    }
  }, [isHome]);

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
