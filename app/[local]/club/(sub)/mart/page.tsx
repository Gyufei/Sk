"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { useContext, useEffect, useState } from "react";
import { formatNum } from "@/lib/utils/number";
import { IProduct, useMartProducts } from "@/lib/api/use-mart-products";
import { useMartBuy } from "@/lib/api/use-mart-buy";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";

export default function MartPage() {
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const { data: products } = useMartProducts();

  const { trigger: buyAction, isMutating } = useMartBuy();

  async function handleBuy(item: IProduct) {
    const res = await buyAction({
      productId: item.product_id,
    } as any);

    if (res.webUrl) {
      window.open(res.webUrl);
    }
  }

  useEffect(() => {
    if (isMutating) {
      setGlobalMessage({
        type: "success",
        message: T("PayingIsBeingInitiated"),
      });
    } else {
      setGlobalMessage(null);
    }
  }, [isMutating, T, setGlobalMessage]);

  return (
    <div className="relative h-full">
      <div className="relative flex items-center md:justify-end">
        <GoBackTo />
      </div>
      <div className="trans-scroll-bar  content-w-540 mt-6 flex h-[calc(100%-70px)] flex-wrap gap-x-[10px] gap-y-5 overflow-y-auto md:pr-3">
        {(products || []).map((item, index) => (
          <div
            key={item.product_id}
            className="content-w-250 content-w-165 box-border flex  cursor-pointer justify-center rounded-[20px] border border-transparent hover:border-white md:p-[5px]"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <div className="content-w-240 content-w-165  flex flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md">
              <Image
                src={item.product_display_picture || "/images/590.png"}
                width={240}
                height={240}
                alt="mart"
                className="content-w-165 content-h-165 rounded-[20px] "
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
                      {formatNum(String(item.product_price).replace("$", ""))}
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
                      onClick={() => handleBuy(item)}
                      src={
                        hoverIndex === index
                          ? "/icons/buy-car.svg"
                          : "/icons/buy-car-gray.svg"
                      }
                      width={18}
                      height={18}
                      alt="buy-car"
                      className="cursor-pointer"
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
