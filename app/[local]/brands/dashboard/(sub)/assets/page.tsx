"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { BreadCrumbs } from "@/components/bread-crumbs";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: userInfo } = useFetchUserInfo();
  const router = useRouter();

  const assets = useMemo(() => {
    const realAssets = userInfo?.club_digital_assets || [];
    // const realAssets = [
    //   ...(userInfo?.club_digital_assets || []),
    //   {
    //     asset_id:
    //       "303aa50ba3b6b4490720e8e3facd24ac78c450a4be804b93b2ca7b51caea3",
    //     asset_description: "$MON $100 at 50K Mcap",
    //     asset_logo: "/images/goods/monad.svg",
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

  function handleCart() {
    router.push("/mart");
  }

  return (
    <div className="m-t-20 content-w-760 relative">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 min-h-[50vh]">
        <div className="flex flex-wrap justify-between gap-5 sm:flex-nowrap">
          <div className="grid w-full grid-cols-2 gap-[15px] sm:grid-cols-3 sm:gap-5 mb-0">
            {assets.map((ast: any, index: number) => (
              <div
                className="flex h-[44vw] w-[44vw] flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] p-4 backdrop-blur-md sm:h-[160px] sm:w-[160px] "
                key={index}
              >
                {ast.asset_id ? (
                  <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
                    <div
                      onClick={handleCart}
                      className="group absolute -right-[6px] -top-[6px] flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full bg-[rgba(214,214,214,0.1)] group-hover:bg-[rgba(255,255,255,0.1)] data-[disabled=true]:opacity-50 sm:h-8 sm:w-8"
                    >
                      <Image
                        width={18}
                        height={18}
                        alt={"buy-car"}
                        className={
                          "h-[14px] w-[14px] group-hover:hidden sm:h-[18px] sm:w-[18px]"
                        }
                        src={"/icons/buy-car-gray.svg"}
                      />
                      <Image
                        width={18}
                        height={18}
                        alt={"buy-car"}
                        className={
                          "hidden h-[14px] w-[14px] group-hover:inline-block sm:h-[18px] sm:w-[18px]"
                        }
                        src={"/icons/buy-car.svg"}
                      />
                    </div>
                    <Image
                      src={ast.asset_logo}
                      width={48}
                      height={48}
                      alt="mint wallet"
                      className="mt-4"
                    />
                    <div className="px-1 text-center text-base font-semibold text-[#ffffff60]">
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
