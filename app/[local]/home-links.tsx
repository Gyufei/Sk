"use client";
import Image from "next/image";
import { UuidAtom } from "@/lib/api/state";
import { useAtomValue } from "jotai";
import { useFullPath } from "@/lib/use-full-path";
import { useMemo } from "react";
import { LinkComp } from "./link-comp";

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
          id: "Dashboard",
          pathname: "/dashboard",
          href: "/dashboard",
          name: "Dashboard",
        },
      ];
    }
    return [];
  }, [isBrands]);

  if (isJuu17Home || isOneHome) {
    return null;
  }

  return (
    <div className="relative flex w-full flex-col text-white/80 sm:static sm:w-fit">
      {uuid && isBrands && (
        <LinkComp
          className="absolute right-0 top-0 sm:static sm:mb-[5px]"
          href={walletsLink.href}
        >
          <Image
            className="my-[5px]"
            src={walletsLink.src}
            width={40}
            height={40}
            alt=""
          />
        </LinkComp>
      )}
      {homeLinks.map((item) => (
        <LinkComp key={item.name} href={item.href}>
          {item.name}
        </LinkComp>
      ))}
    </div>
  );
}
