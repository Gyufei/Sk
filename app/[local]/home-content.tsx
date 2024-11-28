"use client";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import SignDialog from "@/components/sign-dialog";

export default function HomeContent({ children }: { children: React.ReactNode }) {
  const uuid = useAtomValue(UuidAtom);


  return (
    <div className="right-block content-container md:min-h-unset relative min-h-[200.0025px]">
      {uuid ? children : <SignDialog />}
    </div>
  );
}
