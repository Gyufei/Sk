"use client";
import { usePathname, useRouter } from "@/app/navigation";
import { useEffect } from "react";

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/home");
    }
  }, [pathname]);

  return null;
}
