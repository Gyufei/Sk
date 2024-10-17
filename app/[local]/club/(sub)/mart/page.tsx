"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { useState } from "react";
import { formatNum } from "@/lib/utils/number";

export default function MartPage() {
  const range: any[] = [{
    "product_id": "7cf00f4d262da76a934faf6be8995e74322f32f24aa6f9b309596c861a40505e",
    "product_name": "T-shirt",
    "product_price": '1000',
    "product_display_picture": "/images/goods/tshirt.svg"
  }, {
    "product_id": "ee503760a0ad3f6175a63f1d279df2f169d06dbcfc344bab1b50fada699989b9",
    "product_name": "Juu17 Cup",
    "product_price": "340",
    "product_display_picture": "/images/goods/cup.svg"
  }, {
    "product_id": "acdb9b8e28796051ac969937fc6fdeee20588761915d34de0ffbf6009805ac1d",
    "product_name": "Safu Talk",
    "product_price": "1700",
    "product_display_picture": "/images/goods/safu.svg"
  }];

  const [hoverIndex, setHoverIndex] = useState(-1);

  return (
    <div className="relative">
      <div className="relative flex items-center md:justify-end">
        <GoBackTo />
      </div>
      <div className="trans-scroll-bar  mt-6 flex h-[calc(100%-100px)] md:w-[540px] flex-wrap gap-x-[10px] gap-y-5 overflow-y-auto md:pr-3">
        {range.map((item, index) => (
          <div
            key={item}
            className="box-border flex md:w-[250px] cursor-pointer justify-center rounded-[20px] border border-transparent md:p-[5px] hover:border-white"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <div className="flex md:w-[240px] w-[165px] flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md">
              <Image
                src={item.product_display_picture || '/images/590.png'}
                width={240}
                height={240}
                alt="mart"
                className="rounded-[20px] md:w-[240px] md:h-[240px] w-[165px] h-[165px]"
              ></Image>
              <div
                className="p-[15px]"
                style={{
                  color: hoverIndex === index ? "white" : "#d6d6d6",
                }}
              >
                <div className="break-words text-base font-medium leading-6">
                  {item.product_name}
                </div>
                <div className="mt-5 flex justify-between">
                  <div>
                    <span className="text-base leading-6">$</span>
                    <span className="text-2xl leading-9">
                      {formatNum(item.product_price)}
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
