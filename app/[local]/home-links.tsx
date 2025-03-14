"use client";
import Image from "next/image";
import { usePathname, useRouter } from "@/app/navigation";

const homeLinks = [
  { id: "home", pathname: "/home", href: "/home", name: "Home" },
  { id: "mart", pathname: "/mart", href: "/mart", name: "Mart" },
  { id: "club", pathname: "/club", href: "/club", name: "Club" },
  {
    id: "wallets",
    pathname: "/wallets",
    href: "/wallets",
    name: "Wallets",
    src: "/icons/wallets.svg",
  },
];

export default function HomeLinks() {
  const pathname = usePathname();
  const router = useRouter();

  function isPathActive(href: string): boolean {
    return pathname.startsWith(href);
  }

  return (
    <ul className="navbar">
      {homeLinks.map((item) => (
        <li
          key={item.name}
          className={`${isPathActive(item.href) ? "active" : ""} font-haasDisp`}
          data-id={item.id}
          onClick={() => router.push(item.href)}
        >
          {item.src ? (
            <Image src={item.src} width={40} height={40} alt="" />
          ) : (
            item.name
          )}
        </li>
      ))}
    </ul>
  );
}
