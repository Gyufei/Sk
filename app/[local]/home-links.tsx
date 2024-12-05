"use client";
import { usePathname, useRouter } from "@/app/navigation";

const homeLinks = [
  { id: 'home', pathname: '/home', href: '/home', name: 'Home'},
  { id: 'mart', pathname: '/mart', href: '/mart', name: 'Mart'},
  { id: 'club', pathname: '/club', href: '/club', name: 'Club'},
  { id: 'point', pathname: '/point', href: '/point', name: 'Point'}
]

export default function HomeLinks() {
  const pathname = usePathname();
  const router = useRouter();

  function isPathActive(href: string): boolean {
    return pathname.startsWith(href)
  }

  return (
    <ul className="navbar">
      {
        homeLinks.map((item) => (
          <li key={item.name} className={`${isPathActive(item.href) ?  "active" : ""} font-haasText`} data-id={item.id}
            onClick={() => router.push(item.href)}
          >
            {item.name}
          </li>
        ))
      }
    </ul>
  );
}
