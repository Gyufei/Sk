"use client";
import Image from "next/image";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import FeatureItem from "./feature-item";
import { IconBtn } from "@/components/icon-btn";

export default function DomainRedirect() {
  const T = useTranslations("Common");
  const [yourId, setYourId] = useState<string | null>(null);
  const [redirectHost, setRedirectHost] = useState<string | null>(null);

  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      return;
    }
  }

  function handleSave() {
    return;
  }

  return (
    <FeatureItem title={T("DomainRedirect")}>
      <div className="md:mt-[10px] flex flex-1 items-center justify-between self-stretch">
        <div className="relative flex-1">
          <Input
            onKeyDown={handleKeyDown}
            value={yourId || ""}
            onChange={(e: any) => setYourId(e.target.value)}
            className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 md:text-base text-sm text-white"
            placeholder="yourid"
          />
          <div className="absolute md:right-2 left-11 top-[10px] flex items-center md:gap-3">
            <div className="h-3 w-[1px] bg-[#d8d8d8] opacity-40"></div>
            <span className="md:text-base text-sm leading-6 text-[#d6d6d6]">
              .juu17.com
            </span>
          </div>
        </div>
        <Image
          src="/icons/arrow-right.svg"
          width={24}
          height={24}
          alt="right"
          className="mx-3"
        />
        <div className="flex-1">
          <Input
            onKeyDown={handleKeyDown}
            value={redirectHost || ""}
            onChange={(e: any) => setRedirectHost(e.target.value)}
            className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-base text-white"
            placeholder="https://"
          />
        </div>
        <IconBtn
          disabled={!yourId || !redirectHost}
          handleClick={handleSave}
        />
      </div>
    </FeatureItem>
  );
}