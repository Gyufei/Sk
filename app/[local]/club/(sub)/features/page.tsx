"use client";
import Image from "next/image";
import { useState } from "react";

import { GoBackTo } from "@/components/go-back-to";
import { Input } from "@/components/ui/input";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { formatNum } from "@/lib/utils/number";
import { SaveBtn } from "../info/social-media/save-btn";
import { useTranslations } from "next-intl";

export default function Page() {
  const T = useTranslations("Common");
  const { data: userInfo } = useFetchUserInfo();
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
    <div className="relative content-w-600 m-t-20 ">
      <div className="relative flex items-center justify-end">
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 content-w-600 ">
        <div className="mt-5 flex h-[180px] w-full flex-col items-start justify-start rounded-[20px] bg-[rgba(255,255,255,0.1)] p-6 backdrop-blur-md">
          <div className="text-xl font-semibold leading-[30px] text-white">
            {T("Features")}
          </div>
          <div className="mt-5 text-base font-medium leading-6 text-[#D6D6D6]">
            {T("DomainRedirect")}
          </div>
          <div className="md:mt-[10px] flex items-center justify-between self-stretch">
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
            <SaveBtn
              disabled={!yourId || !redirectHost}
              handleSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
