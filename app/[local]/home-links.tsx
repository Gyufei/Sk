"use client";
import { Link, usePathname } from "@/app/navigation";

export default function HomeLinks() {
  const pathname = usePathname();

  return (
    <ul className="navbar">
      <li className={pathname === "/home" ? "active" : ""} data-id="home">
        <Link href="/home">Home</Link>
      </li>
      <li className={pathname === "/mart" ? "active" : ""} data-id="mart">
        <Link href="/mart">Mart</Link>
      </li>
      <li className={pathname === "/club" ? "active" : ""} data-id="club">
        <Link href="/club">Club</Link>
      </li>
      <li className={pathname === "/point" ? "active" : ""} data-id="point">
        <Link href="/point">Point</Link>
      </li>
    </ul>
  );
}
