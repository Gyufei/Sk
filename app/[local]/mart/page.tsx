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

  const productClass = "flex-1 sm:flex-auto sm:w-[240px] md:w-[250px]";

  return (
    <div className="pd-[100px] sm:pd-0 sm:trans-scroll-bar content-w-540 mt-6 flex h-fit flex-wrap gap-x-[10px] gap-y-5 align-top sm:gap-x-[10px] md:-ml-[250px] md:max-h-[calc(100%-70px)] md:overflow-y-auto md:pr-2 md:mr-1">
      {(products || []).map((item) => (
        <div
          key={item.product_id}
          className={`${productClass} group box-border flex h-fit cursor-pointer justify-center rounded-[20px] border border-transparent hover:border-white md:p-[5px]`}
        >
          <div className="flex w-full min-w-[165px] flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md sm:h-[350px] sm:w-[240px]">
            <Image
              src={item.product_display_picture || "/images/590.png"}
              width={240}
              height={240}
              alt="mart"
              className="w-full rounded-[20px] "
            ></Image>
            <div className="#d6d6d6 p-[15px] group-hover:text-white">
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
                  onClick={() => handleBuy(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(214,214,214,0.1)] group-hover:bg-[rgba(255,255,255,0.1)]"
                >
                  <Image
                    width={18}
                    height={18}
                    alt={"buy-car"}
                    className={"group-hover:hidden"}
                    src={"/icons/buy-car-gray.svg"}
                  />
                  <Image
                    width={18}
                    height={18}
                    alt={"buy-car"}
                    className={"hidden group-hover:inline-block"}
                    src={"/icons/buy-car.svg"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {(products || []).length % 2 === 1 && (
        <div className={`${productClass}`} />
      )}
    </div>
  );
}
