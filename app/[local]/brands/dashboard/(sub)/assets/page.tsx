"use client";
import { GoBackTo } from "@/components/go-back-to";
import { BreadCrumbs } from "@/components/bread-crumbs";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useMemo } from "react";

export default function Page() {
  const { data: userInfo } = useFetchUserInfo();

  const assets = useMemo(() => {
    return userInfo?.club_digital_assets || [];
  }, [userInfo]);

  return (
    <div className="m-t-20 content-w-760 relative">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6">
        <div className="grid w-full grid-cols-2 gap-[15px] sm:grid-cols-3 sm:gap-[20px]">
          {!assets?.length
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="flex h-[44vw] w-[44vw] flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md sm:h-[240px] sm:w-[240px] "
                  key={index}
                ></div>
              ))
            : assets.map((_: any, index: number) => {
                return (
                  <div
                    className="flex h-[44vw] w-[44vw] flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md sm:h-[240px] sm:w-[240px] "
                    key={index}
                  ></div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
