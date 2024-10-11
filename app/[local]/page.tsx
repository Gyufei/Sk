"use client";
import { usePathname, useRouter } from "@/app/navigation";
import { useEffect } from "react";

export default function LocalePage() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/" || pathname === "/en" || pathname === "/zh") {
      router.push(`${pathname === "/" ? "/en" : pathname}/home`);
    }
  }, [pathname, router]);
  return null;
}