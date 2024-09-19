"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai/react";
import Image from "next/image";
import { UuidAtom } from "@/lib/state";
import { useRouter } from "next/navigation";

export default function SubLayout({ children }: { children: React.ReactNode }) {
  const uuid = useAtomValue(UuidAtom);
  const router = useRouter();

  useEffect(() => {
    if (!uuid) {
      router.replace("/club");
    }
  }, [uuid, router]);

  function handleBack() {
    window.history.back();
  }

  return (
    <>
      <div className="absolute bottom-[-75px] left-[0px] flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.1)] backdrop-blur-md md:-left-[84px] md:top-[4px]">
        <Image
          onClick={handleBack}
          className="cursor-pointer"
          src="/icons/back.svg"
          width={30}
          height={30}
          alt="back"
        />
      </div>
      <div className="top-content active !rounded-none !bg-transparent !backdrop-blur-none">
        <div className="content-inner-box trans-scroll-bar !justify-start overflow-y-visible !py-0 !pl-0 !pr-2 md:overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
