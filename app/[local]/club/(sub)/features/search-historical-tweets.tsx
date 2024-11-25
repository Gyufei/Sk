"use client";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import FeatureItem from "./feature-item";
import { IconBtn } from "@/components/icon-btn";
import { formatDate } from "@/lib/utils/utils";

export default function SearchHistoricalTweets() {
  const tweetList: any[] = [];
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
        <div className="flex flex-1 items-center justify-between self-stretch md:mt-[10px]">
          <div className="relative flex-1">
            <Input
              onKeyDown={handleKeyDown}
              value={searchKey || ""}
              onChange={(e: any) => setSearchKey(e.target.value)}
              className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-sm text-white md:text-base"
              placeholder={T("SearchKeyword")}
            />
          </div>
          <IconBtn
            className="mt-0"
            defaulImage={"/icons/search.svg"}
            hoverImage={"/icons/search-black.svg"}
            handleClick={handleSave}
          />
        </div>
      </FeatureItem>
      <div className="mt-10 px-6">
        <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
          {T("SearchResults")} ({(tweetList || []).length})
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
              className="py-4 text-base leading-6 text-[#d6d6d6]"
              style={{
                boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
              }}
            >
              <div>{item.content}</div>
              <div className="mt-3 flex justify-between text-sm">
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
