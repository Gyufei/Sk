"use client";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { SaveBtn } from "../info/social-media/save-btn";
import { useTranslations } from "next-intl";
import FeatureItem from "./feature-item";
import { IconBtn } from "@/components/icon-btn";
import { formatDate } from "@/lib/utils/utils";

export default function SearchHistoricalTweets() {
  const tweetList: any[] = [
    { content: 'Li Bai, also known as Taibai and Qinglian Jushi, was a romantic poet of the Tang Dynasty', create_at: '2024-4-1 23:11:11' },
    
  ];
  const T = useTranslations("Common");
  const [searchKey, setSearchKey] = useState<string | null>(null);
  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      handleSave();
      return;
    }
  }

  function handleSave() {
    return;
  }

  return (
    <>
      <FeatureItem title={T("SearchHistoricalTweets")}>
        <div className="md:mt-[10px] flex flex-1 items-center justify-between self-stretch">
          <div className="relative flex-1">
            <Input
              onKeyDown={handleKeyDown}
              value={searchKey || ""}
              onChange={(e: any) => setSearchKey(e.target.value)}
              className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 md:text-base text-sm text-white"
              placeholder={T("SearchKeyword")}
            />
          </div>
          <IconBtn
            defaulImage = {"/icons/search.svg"}
            hoverImage = {"/icons/search-black.svg"}
            handleClick={handleSave}
          />
        </div>
      </FeatureItem>
      <div className="mt-10 px-6">
          <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
            {T("SearchResults")} ({(tweetList ||[]).length})
          </div>
          <div className="mt-5">
            {!tweetList?.length && (
              <div className="flex h-[50px] items-center justify-start text-xl">
                {T("NoData")}
              </div>
            )}
            {(tweetList || [])?.map((item: any, index: number) => (
              <div
                key={index}
                className="text-base py-4 leading-6 text-[#d6d6d6]"
                style={{
                  boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
                }}
              >
                <div>{item.content}</div>
                <div className="flex justify-between text-sm mt-3">
                  <div>Main Tweet</div>
                  <div>{formatDate(item.create_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </>
  );
}