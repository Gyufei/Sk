"use client";
import { usePathname, useRouter } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    router.push("/home");
  }
}
