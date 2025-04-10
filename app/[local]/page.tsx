"use client";
import { usePathname, useRouter } from "@/app/navigation";

export default function LocalePage() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    router.push("/one");
  }

  return null;
}
