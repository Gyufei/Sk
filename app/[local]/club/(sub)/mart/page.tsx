"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { useState } from "react";
import { formatNum } from "@/lib/utils/number";

export default function MartPage() {
  const range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [hoverIndex, setHoverIndex] = useState(-1);

  return (
    <div className="absolute h-full md:-left-[50%]">
      <div className="relative flex items-center justify-end">
        <GoBackTo />
      </div>
      <div className="trans-scroll-bar  mt-6 flex h-[calc(100%-100px)] w-[540px] flex-wrap gap-x-[10px] gap-y-5 overflow-y-auto pr-3">
        {range.map((item, index) => (
          <div
            key={item}
            className="box-border flex w-[250px] cursor-pointer justify-center rounded-[20px] border border-transparent p-[5px] hover:border-white"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <div className="flex w-[240px] flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md">
              <Image
                src="/images/590.png"
                width={240}
                height={240}
                alt="mart"
                className="rounded-[20px]"
              ></Image>
              <div
                className="p-[15px]"
                style={{
                  color: hoverIndex === index ? "white" : "#d6d6d6",
                }}
              >
                <div className="break-words text-base font-medium leading-6">
                  TextTextTextTextTextTextTextText
                </div>
                <div className="mt-5 flex justify-between">
                  <div>
                    <span className="text-base leading-6">$</span>
                    <span className="text-2xl leading-9">
                      {formatNum(20000)}
                    </span>
                  </div>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        hoverIndex === index
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(214, 214, 214, 0.1)",
                    }}
                  >
                    <Image
                      src={
                        hoverIndex === index
                          ? "/icons/buy-car.svg"
                          : "/icons/buy-car-gray.svg"
                      }
                      width={18}
                      height={18}
                      alt="buy-car"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
