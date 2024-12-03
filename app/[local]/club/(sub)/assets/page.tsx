"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { BreadCrumbs } from "@/components/bread-crumbs";

const mockList = ["A", "B", "C", "D"];

export default function Page() {
  return (
    <div className="m-t-20 relative content-w-760">
      <div className="relative flex flex-row-reverse items-end justify-between jm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6">
        <div className="flex flex-wrap justify-between gap-5 jm:flex-nowrap">
          <div className="flex w-full flex-wrap items-center justify-between gap-[15px] jm:gap-[20px] jm:w-[520px]">
            {mockList.map((item, index) => {
              return (
                <div
                  className="flex w-[44vw] h-[44vw] jm:h-[240px] jm:w-[240px] flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md "
                  key={index}
                ></div>
              );
            })}
          </div>

          <div className="flex w-full flex-row items-center  justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] px-8 py-6 backdrop-blur-md jm:h-[250px] jm:w-[240px] md:flex-col md:justify-center md:bg-transparent">
            <div className="flex h-20 w-20 items-center justify-center">
              <Image
                src="/icons/mint-wallet.svg"
                width={60}
                height={60}
                alt="mint wallet"
              />
            </div>
            <div>
              <div className="flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] bg-[rgba(255,255,255,0.01)] px-4 text-base leading-6 text-[rgba(255,255,255,0.6)] hover:text-white md:mt-5 md:w-[200px]">
                <span className="inline-block font-semibold md:mr-6">Mint</span>
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
              <div className="mt-3 text-center text-base opacity-80">
                Eligible item: 3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
