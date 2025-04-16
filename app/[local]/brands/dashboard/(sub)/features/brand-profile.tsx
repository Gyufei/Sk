"use client";
import { useContext, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { Input } from "@/components/ui/input";
import { IconBtn } from "@/components/icon-btn";
import { ApiHost } from "@/lib/api/path";
import { GlobalMsgContext } from "@/components/global-msg-context";
import fetcher from "@/lib/api/fetcher";
import { UuidAtom } from "@/lib/api/state";
import FeatureItem from "./feature-item";

export default function BrandProfile() {
  const T = useTranslations("Common");
  const [yourId, setYourId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const uuid = useAtomValue(UuidAtom);

  const { data } = useSWR("getSubdomain", getSubdomain);

  useEffect(() => {
    if (!data) return;
    if (data.subdomain) setYourId(data.subdomain);
  }, [data]);

  function getSubdomain() {
    return fetcher(`${ApiHost}/subdomain?user_id=${uuid}`, {
      method: "GET",
    });
  }

  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      return;
    }
  }

  async function handleSave() {
    if (loading) return;
    setLoading(true);
    const res: any = await fetcher(`${ApiHost}/subdomain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        subdomain: yourId,
      }),
    });
    setLoading(false);
    if (res.status === false) {
      setGlobalMessage({
        type: "error",
        message: res.msg || "Submit failed, please try again",
      });
      return;
    }
  }

  return (
    <FeatureItem title={T("BrandProfile")}>
      <div className="mt-[10px] flex flex-1 flex-col items-center justify-between self-stretch sm:flex-row">
        <div className="relative w-full sm:flex-1">
          <div className="absolute left-0 top-[12px] flex w-fit items-center gap-1 sm:right-2 sm:gap-3">
            <span className="text-base leading-6 text-[#d6d6d6]">
              https://juu17.com
            </span>
            <div className="mr-[12px] h-3 w-[1px] bg-[#d8d8d8] opacity-40"></div>
          </div>
          <Input
            onKeyDown={handleKeyDown}
            value={yourId || ""}
            onChange={(e: any) => setYourId(e.target.value)}
            className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-[140px] text-base text-white sm:pl-[150px]"
            placeholder="your profile handle"
          />
        </div>

        <IconBtn
          className={"mt-[20px] w-full"}
          disabled={!yourId}
          btnText={T("Save")}
          handleClick={handleSave}
        />
      </div>
    </FeatureItem>
  );
}
