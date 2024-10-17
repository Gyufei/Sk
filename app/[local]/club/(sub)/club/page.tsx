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
    <div className="relative w-full   m-t-20 ">
      <div className="relative flex items-center justify-end">
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 md:w-[600px]">
        <div className="flex justify-between gap-5">
          <div className="flex h-[290px] md:w-[290px] w-full flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md">
            <div className="flex h-20 w-20 items-center justify-center">
              <Image
                src="/icons/mint-wallet.svg"
                width={60}
                height={60}
                alt="mint wallet"
              />
            </div>
            <div className="mt-5 flex h-12 md:w-[200px] cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] bg-[rgba(255,255,255,0.01)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:text-white">
              <span className="md:mr-6 inline-block font-semibold">Mint</span>
              <span>on</span>
              <Image
                src="/icons/network/solana.svg"
                width={16}
                height={16}
                alt="solana"
                className="ml-2 mr-1"
              />
              <span>Solana</span>
            </div>
          </div>

          <div className="flex h-[290px] md:w-[290px] w-full  flex-col items-start justify-start rounded-[20px] bg-[rgba(255,255,255,0.1)] md:p-6 p-3 backdrop-blur-md">
            <div className="font-haasDisp md:text-2xl text-base font-semibold text-[rgba(255,255,255,0.6)]">
              Juu17 {T("Club")} {T("Points")}
            </div>
            <div className="mt-2 text-[40px] leading-[60px] text-white">
              {formatNum(userInfo?.j_points || 0)}
            </div>
            <div className="mt-5 font-haasDisp text-2xl text-base font-semibold text-[rgba(255,255,255,0.6)]">
              {T("Multipliers")}
            </div>
            <div className="mt-[10px] flex items-center justify-start self-stretch">
              <div className="md:mr-[85px] mr-[10px] flex flex-col">
                <span className="text-xl font-medium leading-[30px] text-[rgba(255,255,255,0.6)]">
                  {T("Cup")}
                </span>
                <span className="text-[32px] leading-[40px] text-white">
                  {formatNum(userInfo?.multipliers?.cup || 0)}×
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-medium leading-[30px] text-[rgba(255,255,255,0.6)]">
                  {T("XAccount")}
                </span>
                <span className="text-[32px] leading-[40px] text-white">
                  {formatNum(userInfo?.multipliers?.x_account || 0)}×
                </span>
              </div>
            </div>
          </div>
        </div>

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
