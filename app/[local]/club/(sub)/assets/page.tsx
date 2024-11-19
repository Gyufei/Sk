"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { BreadCrumbs } from "@/components/bread-crumbs";
const mockList = ["A", "B", "C", "D"];
export default function Page() {
  console.log(mockList)
  return (
    <div className="relative w-full   m-t-20 ">
      <div className="relative flex items-end justify-between">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 content-w-700 ">
        <div className="flex justify-between gap-5 flex-wrap md:flex-nowrap">
          <div className="flex flex-wrap items-center justify-between gap-5 md:w-[520px] w-full">
            {
              mockList.map((item, index) => {
                return (
                  <div className="flex h-[240px] md:w-[240px] w-full flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md" key={index}></div>
                 
                )
              })
            }
          </div>
          
          <div className="flex h-[290px] md:w-[240px] w-full flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0)] backdrop-blur-md">
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
        </div>
      </div>
    </div>
  );
}
