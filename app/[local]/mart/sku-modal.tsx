"use client";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IProduct } from "@/lib/api/use-mart-products";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ClothSize } from "./cloth-size";

export interface SkuModalProps {
  open: boolean;
  skuInfo?: IProduct;
  onOpenChange: (value: boolean) => void;
  onSkuConfirm: (item: IProduct, selectedSize: string) => void;
}

export default function SkuModal({
  open,
  skuInfo,
  onOpenChange,
  onSkuConfirm,
}: SkuModalProps) {
  const skuAttr = skuInfo?.skuAttr || [];
  const skuImage = skuInfo?.skuImage;

  const [selectedSku, setSelectedSku] = useState<string | undefined>();
  const T = useTranslations("Common");
  const isDesktop = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    setSelectedSku(undefined);
  }, [skuInfo?.product_id]);

  const skuContent = (
    <div className={`${!isDesktop && "paddingBottomStyle-64"}`}>
      {skuImage && <ClothSize />}
      <div className="mt-5">
        {skuAttr.map((item) => (
          <>
            <div
              key={item.skuName}
              className="mb-2 font-haasDisp text-xl font-medium text-white "
            >
              {T(item.skuName.charAt(0).toUpperCase() + item.skuName.slice(1))}
            </div>
            <div className="flex flex-row flex-wrap gap-[13px]">
              {item.skuValue.map((item) => (
                <div
                  key={item.value}
                  className={`flex h-[48px] min-w-[76px]  cursor-pointer items-center justify-center rounded-lg p-4 text-base font-medium ${
                    selectedSku !== item.value &&
                    "bg-[rgba(255, 255, 255, 0.01)] border-[rgba(255, 255, 255, 0.6)] border text-[#D6D6D6] hover:brightness-75"
                  } ${
                    selectedSku === item.value &&
                    "border border-[#fff]  bg-[#fff] text-[#0D0D0D] hover:brightness-100"
                  }`}
                  onClick={() => setSelectedSku(item.value)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </>
        ))}
      </div>
      <div
        className={`bg-[#252525] ${
          !isDesktop &&
          "z-100 paddingBottomStyle-16 fixed bottom-0 left-0 right-0 px-[16px]"
        }`}
      >
        <div
          data-disabled={!selectedSku}
          className={`${
            isDesktop && "mt-[40px]"
          } flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:brightness-100
              `}
          onClick={() => {
            if (!selectedSku || !skuInfo) return;
            onSkuConfirm(skuInfo, selectedSku);
          }}
        >
          {T("ConfirmToPay")}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showOverlay={false}
          showClose={true}
          className={
            "rounded-5 flex w-[480px] flex-col border-none bg-[#252525] p-6"
          }
        >
          <DialogTitle className="font-haasDisp text-white">
            {T("SelectSize")}
          </DialogTitle>
          <div>{skuContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="py-0 text-center">
          <DrawerTitle>{T("SelectSize")}</DrawerTitle>
        </DrawerHeader>
        <div className="no-scroll-bar relative overflow-y-auto">
          {skuContent}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
