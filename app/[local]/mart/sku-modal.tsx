"use client";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IProduct } from "@/lib/api/use-mart-products";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";


export interface SkuModalProps {
  open: boolean;
  skuInfo?: IProduct;
  onOpenChange: (value: boolean) => void;
  onSkuConfirm: (item: IProduct, selectedSize: string) => void;
}
export default function SkuModal(props: SkuModalProps) {
  const {
    open,
    skuInfo,
    onOpenChange,
    onSkuConfirm
  } = props;
  const skuAttr = skuInfo?.skuAttr || [];
  const skuImage = skuInfo?.skuImage;

  const [seletedSku, setSeletedSku] = useState<string | undefined>();
  const T = useTranslations("Common");
  const isDesktop = useMediaQuery("(min-width: 640px)")

  useEffect(() => {
    setSeletedSku(undefined)
  }, [skuInfo?.product_id])

  const skuContent = (
    <div className={`${!isDesktop && 'paddingBottomStyle-64'}`}>
        {
          skuImage && (
            <img
              src={skuImage}
              className="w-full mb-5 h-auto"
            />
          )
        }
        <div>
          <div className="font-haasDisp text-xl text-white mb-2 font-medium ">{T("Size")}</div>
          <div className="flex flex-row gap-[13px] flex-wrap">
            {
              skuAttr.map((item) => (
                <div 
                  key={item.value}
                  className={`p-4 min-w-[76px] h-[48px]  flex items-center justify-center rounded-lg text-base font-medium cursor-pointer ${seletedSku !== item.value && 'bg-[rgba(255, 255, 255, 0.01)] text-[#D6D6D6] border border-[rgba(255, 255, 255, 0.6)] hover:brightness-75'} ${seletedSku === item.value && 'bg-[#fff] border  border-[#fff] text-[#0D0D0D] hover:brightness-100'}`}
                  onClick={() => setSeletedSku(item.value)}
                >
                  {item.name}
                </div>
              ))
            }
          </div>
        </div>
        <div className={`bg-[#252525] ${!isDesktop && ('z-100 fixed px-[16px] paddingBottomStyle-16 bottom-0 left-0 right-0')}`}>
          <div
            data-disabled={!seletedSku} 
            className={
              `${isDesktop && 'mt-[40px]'} flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:brightness-100
              `}
            onClick={() => {
              if (!seletedSku || !skuInfo) return;
              onSkuConfirm(skuInfo, seletedSku)
            }}
          >
            {T("ConfirmToPay")}
          </div>
        </div>
    </div>
  )
  
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showOverlay={false}
          showClose={true}
          className={"w-[480px] bg-[#252525] p-6 rounded-5 border-none flex flex-col"}
        >
          <DialogTitle className="font-haasDisp text-white">{T("SizeChart")}</DialogTitle>
          <div>{skuContent}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer 
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <DrawerHeader className="text-center py-0">
          <DrawerTitle>{T("SizeChart")}</DrawerTitle>
        </DrawerHeader>
        <div className="no-scroll-bar overflow-y-auto relative">
          {skuContent}
        </div>
      </DrawerContent>    
    </Drawer>
  )
}


