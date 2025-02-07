"use client";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import SignDialog from "@/components/sign-dialog";
import { usePathname } from "@/app/navigation";
import { useSearchParams } from "next/navigation";

export default function HomeContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const uuid = useAtomValue(UuidAtom);
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const redirectURL = searchParams.get("redirect");

  if (redirectURL) {
    const reUrl = redirectURL + window.location.hash;
    window.location.replace(reUrl);
    return;
  }

  return (
    <div className="right-block content-container md:min-h-unset relative min-h-[200.0025px]">
      {uuid || pathname === "/home" ? children : <SignDialog />}
    </div>
  );
}
