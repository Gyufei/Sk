"use client";
import Image from "next/image";
import { usePathname, useRouter } from "@/app/navigation";
import { UuidAtom } from "@/lib/api/state";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils/utils";

const homeLinks = [
  { id: "home", pathname: "/home", href: "/home", name: "Home" },
  { id: "mart", pathname: "/mart", href: "/mart", name: "Mart" },
  { id: "club", pathname: "/club", href: "/club", name: "Club" },
];

const walletsLink = {
  id: "wallets",
  pathname: "/wallets",
  href: "/wallets",
  name: "Wallets",
  src: "/icons/wallets.svg",
};

export default function HomeLinks() {
  const uuid = useAtomValue(UuidAtom);
  const pathname = usePathname();
  const router = useRouter();

  function isPathActive(href: string): boolean {
    return pathname.startsWith(href);
  }

  return (
    <ul className="navbar relative w-full sm:static sm:w-fit">
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
      {uuid && (
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
    </ul>
  );
}
