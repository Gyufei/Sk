"use client";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { formatNum } from "@/lib/utils/number";
import { IProduct, useMartProducts } from "@/lib/api/use-mart-products";
import { useMartBuy } from "@/lib/api/use-mart-buy";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";

export default function MartPage() {
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);

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

  const productClass = "flex-1 jm:flex-auto jm:w-[240px] jm:w-[250px]";

  return (
    <div className="pd-[100px] jm:pd-0 jm:trans-scroll-bar content-w-540 mt-6 flex h-fit flex-wrap gap-x-[10px] gap-y-[15px] jm:gap-y-5 align-top jm:gap-x-[10px] md:max-h-[calc(100%-70px)] md:overflow-y-auto md:pr-2 md:mr-1">
      {(products || []).map((item) => (
        <div
          key={item.product_id}
          className={`${productClass} group box-border flex h-fit cursor-pointer justify-center rounded-[20px] border border-transparent hover:border-white jm:p-[5px]`}
        >
          <div className="flex w-full min-w-[165px] flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md jm:h-[350px] jm:w-[240px]">
            <Image
              src={item.product_display_picture || "/images/590.png"}
              width={240}
              height={240}
              alt="mart"
              className="w-full rounded-[20px] bg-[#d6d6d6]"
            ></Image>
            <div className="#d6d6d6 p-[10px] jm:p-[15px] group-hover:text-white">
              <div className="break-words text-base font-medium leading-6">
                {item.product_name}
              </div>
              <div className="mt-5 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-[14px] leading-[30px] jm:text-base jm:leading-6  mr-[4px]">$</span>
                  <span className="text-[20px] leading-[30px] jm:text-2xl jm:leading-9 font-medium">
                    {formatNum(String(item.product_price).replace("$", ""))}
                  </span>
                </div>
                <div
                  onClick={() => handleBuy(item)}
                  className="flex w-[24px] h-[24px] jm:h-8 jm:w-8 items-center justify-center rounded-full bg-[rgba(214,214,214,0.1)] group-hover:bg-[rgba(255,255,255,0.1)]"
                >
                  <Image
                    width={18}
                    height={18}
                    alt={"buy-car"}
                    className={"w-[14px] h-[14px] jm:w-[18px] jm:h-[18px] group-hover:hidden"}
                    src={"/icons/buy-car-gray.svg"}
                  />
                  <Image
                    width={18}
                    height={18}
                    alt={"buy-car"}
                    className={"w-[14px] h-[14px] jm:w-[18px] jm:h-[18px] hidden group-hover:inline-block"}
                    src={"/icons/buy-car.svg"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {(products || []).length % 2 === 1 && (
        <div className={`${productClass} min-w-[165px]`} />
      )}
    </div>
  );
}
