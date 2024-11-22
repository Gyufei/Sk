"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { BreadCrumbs } from "@/components/bread-crumbs";
const mockList = ["A", "B", "C", "D"];
export default function Page() {
  console.log(mockList)
  return (
    <div className="relative w-full m-t-20 ">
      <div className="relative flex flex-row-reverse sm:flex-row items-end justify-between">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 content-w-700 ">
        <div className="flex justify-between gap-5 flex-wrap md:flex-nowrap">
          <div className="flex flex-wrap items-center justify-between gap-5 md:w-[520px] w-full">
            {
              mockList.map((item, index) => {
                return (
                  <div className="flex md:h-[240px] md:w-[240px] w-[160px] h-[160px] flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md" key={index}></div>
                )
              })
            }
          </div>
          
          <div className="flex bg-[rgba(255,255,255,0.1)]  px-8 py-6  items-center w-full flex-row justify-between md:flex-col md:h-[250px] md:w-[240px] md:justify-center md:bg-transparent rounded-[20px] backdrop-blur-md">
            <div className="flex h-20 w-20 items-center justify-center">
              <Image
                src="/icons/mint-wallet.svg"
                width={60}
                height={60}
                alt="mint wallet"
              />
            </div>
            <div>
              <div className="md:mt-5 px-4 flex h-12 md:w-[200px] cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] bg-[rgba(255,255,255,0.01)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:text-white">
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
              <div className="mt-3 text-center text-base opacity-80">Eligible item: 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
