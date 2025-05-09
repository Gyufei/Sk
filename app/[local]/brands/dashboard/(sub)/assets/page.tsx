"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { BreadCrumbs } from "@/components/bread-crumbs";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useMemo } from "react";

export default function Page() {
  const { data: userInfo } = useFetchUserInfo();

  const assets = useMemo(() => {
    const realAssets = userInfo?.club_digital_assets || [];
    // const realAssets = [
    //   ...(userInfo?.club_digital_assets || []),
    //   {
    //     asset_id:
    //       "303aa50ba3b6b4490720e8e3facd24ac78c450a4be804b93b2ca7b51caea3",
    //     asset_description: "$MON $100 at 50K Mcap",
    //     asset_logo: "/images/goods/seoulana.svg",
    //   },
    //   {
    //     asset_id:
    //       "f1baa5443585e92c13dc9b79b4ff3e0b15d0a0850bcd10836a1ee8c7ceba7",
    //     asset_description: "Seoulana April 2025",
    //     asset_logo: "/images/goods/seoulana.svg",
    //   },
    // ];

    const placeAssets = Array.from(
      { length: 6 - realAssets.length },
      (_, index) => index,
    );

    return [...realAssets, ...placeAssets];
  }, [userInfo]);

  return (
    <div className="m-t-20 content-w-760 relative">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 min-h-[50vh]">
        <div className="flex flex-wrap justify-between gap-5 sm:flex-nowrap">
          <div className="mb-0 grid w-full grid-cols-2 gap-[15px] sm:grid-cols-3 sm:gap-5">
            {assets.map((ast: any, index: number) => (
              <div
                className="flex h-[44vw] w-[44vw] flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] p-4 backdrop-blur-md sm:h-[160px] sm:w-[160px] "
                key={index}
              >
                {ast.asset_id ? (
                  <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
                    <Image
                      src={ast.asset_logo}
                      width={48}
                      height={48}
                      alt="mint wallet"
                      className="mt-4"
                    />
                    <div className="px-[10px] text-center text-base font-semibold text-[#ffffff60]">
                      {ast.asset_description}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>

          <div className="flex w-full flex-row items-center  justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] px-8 py-6 backdrop-blur-md sm:h-[250px] sm:w-[240px] md:flex-col md:justify-center md:bg-transparent">
            <div className="flex h-20 w-20 items-center justify-center">
              <Image
                src="/icons/mint-wallet.svg"
                width={60}
                height={60}
                alt="mint wallet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}