"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { formatNum } from "@/lib/utils/number";
import { IProduct, useMartProducts } from "@/lib/api/use-mart-products";
import { useMartBuy } from "@/lib/api/use-mart-buy";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";
import SkuModal from "./sku-modal";
import PayDialog from "./pay-dialog";

export default function MartPage() {
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const { data: products } = useMartProducts();

  const { trigger: buyAction, isMutating } = useMartBuy();

  const [payOpen, setPayOpen] = useState<boolean>(false);
  const [skuOpen, setSkuOpen] = useState<boolean>(false);

  const [skuInfo, setSkuInfo] = useState<IProduct>();
  const [payInfo, setPayInfo] = useState<IProduct>();

  const selectedSize = useRef<string>();

  async function handleCreateOrder(item: IProduct) {
    const size = selectedSize?.current;

    const res = await buyAction({
      productId: item.product_id,
      selectedSize: size,
    } as any);
    console.log(res);

    setPayInfo(item);
    setPayOpen(true);
    selectedSize.current = undefined;
  }

  function handleCart(item: IProduct) {
    if (item.skuAttr) {
      setSkuInfo(item);
      setSkuOpen(true);
      return;
    }

    handleCreateOrder(item);
  }

  function handleSkuConfirm(item: IProduct, size: string) {
    setSkuOpen(false);
    selectedSize.current = size;

    handleCreateOrder(item);
  }

  function handlePayConfirmed() {
    setGlobalMessage({
      type: "success",
      message: T("PaySuccess"),
    });

    setTimeout(() => {
      setGlobalMessage(null);
    }, 2000);
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
      <div className="pd-[100px] sm:pd-0 sm:trans-scroll-bar content-w-540 mt-6 flex h-fit flex-wrap gap-x-[10px] gap-y-[15px] align-top sm:gap-x-[10px] sm:gap-y-5 md:mr-1 md:max-h-[calc(100%-40px)] md:overflow-y-auto md:pr-2">
        {(products || []).map((item) => (
          <div
            key={item.product_id}
            className={`${productClass} group box-border flex h-fit cursor-pointer justify-center rounded-[20px] border border-transparent hover:border-white sm:rounded-[24px] sm:p-[5px]`}
          >
            <div className="flex w-full min-w-[165px] flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md jm:w-[45.2vw] sm:h-[350px] sm:w-[240px]">
              <Image
                src={item.product_display_picture || "/images/590.png"}
                width={240}
                height={240}
                alt="mart"
                className="w-full rounded-[20px] bg-[#d6d6d6]"
              ></Image>
              <div className="#d6d6d6 p-[10px] group-hover:text-white sm:p-[15px]">
                <div className="break-words text-base font-medium leading-6">
                  {item.product_name}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-[4px] text-[14px] leading-[30px] sm:text-base  sm:leading-6">
                      $
                    </span>
                    <span className="text-[20px] font-medium leading-[30px] sm:text-2xl sm:leading-9">
                      {formatNum(String(item.product_price).replace("$", ""))}
                    </span>
                  </div>
                  <div
                    onClick={() => handleCart(item)}
                    className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[rgba(214,214,214,0.1)] group-hover:bg-[rgba(255,255,255,0.1)] sm:h-8 sm:w-8"
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
      <PayDialog
        open={payOpen}
        onOpenChange={(v) => setPayOpen(v)}
        payInfo={payInfo!}
        onPayConfirmed={handlePayConfirmed}
      />
    </>
  );
}
