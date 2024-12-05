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
      <div className="flex-col sm:flex-row mt-[10px] flex flex-1 items-center justify-between self-stretch">
        <div className="relative w-full sm:flex-1">
          <Input
            onKeyDown={handleKeyDown}
            value={yourId || ""}
            onChange={(e: any) => setYourId(e.target.value)}
            className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-base text-white"
            placeholder="yourid"
          />
          <div className="absolute right-0 sm:right-2 top-[10px] flex items-center sm:gap-3">
            <div className="h-3 w-[1px] bg-[#d8d8d8] opacity-40"></div>
            <span className="text-base leading-6 text-[#d6d6d6]">
              .juu17.com
            </span>
          </div>
        </div>
        <div className="w-full flex flex-1 flex-row-reverse sm:flex-row mt-[20px] sm:mt-0">
          <Image
            src="/icons/arrow-right.svg"
            width={24}
            height={24}
            alt="right"
            className="hidden sm:block mx-3"
          />
          <Image
            src="/icons/redirect-left.svg"
            width={24}
            height={24}
            alt="right"
            className="sm:hidden mx-3"
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
        </div>
      
        <IconBtn
          className={'w-full mt-[20px]'}
          disabled={!yourId || !redirectHost}
          btnText={T('Save')}
          handleClick={handleSave}
        />
      </div>
    </FeatureItem>
  );
}