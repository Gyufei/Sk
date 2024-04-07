"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeLinks() {
  const pathname = usePathname();

  return (
    <ul className="navbar">
      <li className={pathname === "/home" ? "active" : ""} data-id="home">
        <Link href="/home">Home</Link>
      </li>
      <li
        className={pathname === "/dragon-ish" ? "active" : ""}
        data-id="dragon-ish"
      >
        <Link href="/dragon-ish">Dragon-ish</Link>
      </li>
      <li className={pathname === "/club" ? "active" : ""} data-id="club">
        <Link href="/club">Club</Link>
      </li>
      <li className={pathname === "/service" ? "active" : ""} data-id="service">
        <Link href="/service">Service</Link>
      </li>
    </ul>
  );
}
