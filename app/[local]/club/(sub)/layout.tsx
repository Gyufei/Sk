"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/state";
import { useRouter } from "@/app/navigation";

export default function SubLayout({ children }: { children: React.ReactNode }) {
  const uuid = useAtomValue(UuidAtom);
  const router = useRouter();

  useEffect(() => {
    if (!uuid) {
      router.replace("/club");
    }
  }, [uuid, router]);

  return <>{children}</>;
}
