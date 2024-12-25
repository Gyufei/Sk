"use client";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import SignDialog from "@/components/sign-dialog";
import { usePathname } from "@/app/navigation";

export default function HomeContent({ children }: { children: React.ReactNode }) {
  const uuid = useAtomValue(UuidAtom);
  const pathname = usePathname();

  return (
    <div className="right-block content-container md:min-h-unset relative min-h-[200.0025px]">
      {uuid || pathname === '/home' ? children : <SignDialog />}
    </div>
  );
}
