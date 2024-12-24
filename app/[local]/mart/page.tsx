"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { formatNum } from "@/lib/utils/number";
import { IProduct, useMartProducts } from "@/lib/api/use-mart-products";
import { useMartBuy } from "@/lib/api/use-mart-buy";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";
import SkuModal from "./sku-modal";

export default function MartPage() {
  const T = useTranslations("Common");
  const [skuOpen, setSkuOpen] = useState<boolean>(false);

  const [skuInfo, setSkuInfo] = useState<IProduct>();
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const { data: products } = useMartProducts();

  const { trigger: buyAction, isMutating } = useMartBuy();

  async function handleBuy(item: IProduct, selectedSize?: string) {
    const res = await buyAction({
      productId: item.product_id,
      selectedSize
    } as any);

    if (res.webUrl) {
      window.open(res.webUrl);
    }
  }

  function handleCart(item: IProduct) {
    if (item.skuAttr) {
      setSkuInfo(item)
      setSkuOpen(true)
      return
    }
    handleBuy(item)
  }
  
  function handleSkuConfirm(item: IProduct, selectedSize: string) {
    handleBuy(item, selectedSize)
    setSkuOpen(false)
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

  const productClass = "flex-1 sm:flex-auto sm:w-[240px] sm:w-[250px]";

  return (
    <>
      <div className="pd-[100px] sm:pd-0 sm:trans-scroll-bar content-w-540 mt-6 flex h-fit flex-wrap gap-x-[10px] gap-y-[15px] sm:gap-y-5 align-top sm:gap-x-[10px] md:max-h-[calc(100%-40px)] md:overflow-y-auto md:pr-2 md:mr-1">
        {(products || []).map((item) => (
          <div
            key={item.product_id}
            className={`${productClass} group box-border flex h-fit cursor-pointer justify-center rounded-[20px] sm:rounded-[24px] border border-transparent hover:border-white sm:p-[5px]`}
          >
            <div className="flex min-w-[165px] w-full jm:w-[45.2vw] flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md sm:h-[350px] sm:w-[240px]">
              <Image
                src={item.product_display_picture || "/images/590.png"}
                width={240}
                height={240}
                alt="mart"
                className="w-full rounded-[20px] bg-[#d6d6d6]"
              ></Image>
              <div className="#d6d6d6 p-[10px] sm:p-[15px] group-hover:text-white">
                <div className="break-words text-base font-medium leading-6">
                  {item.product_name}
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-[14px] leading-[30px] sm:text-base sm:leading-6  mr-[4px]">$</span>
                    <span className="text-[20px] leading-[30px] sm:text-2xl sm:leading-9 font-medium">
                      {formatNum(String(item.product_price).replace("$", ""))}
                    </span>
                  </div>
                  <div
                    onClick={() => handleCart(item)}
                    className="flex w-[24px] h-[24px] sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[rgba(214,214,214,0.1)] group-hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <Image
                      width={18}
                      height={18}
                      alt={"buy-car"}
                      className={"w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] group-hover:hidden"}
                      src={"/icons/buy-car-gray.svg"}
                    />
                    <Image
                      width={18}
                      height={18}
                      alt={"buy-car"}
                      className={"w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] hidden group-hover:inline-block"}
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
      <SkuModal 
        open={skuOpen}
        onOpenChange={(v) => setSkuOpen(v)}
        skuInfo={skuInfo}
        onSkuConfirm={handleSkuConfirm}
      />
    </>
  );
}
