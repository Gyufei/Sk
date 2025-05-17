"use client";
import { useContext, useRef, useState } from "react";
import { IProduct, useMartProducts } from "@/lib/api/use-mart-products";
import SkuModal from "./sku-modal";
import PayDialog from "./pay-dialog";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useRouter } from "@/app/navigation";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";
import ProductCard from "./product-card";

export default function MartPage() {
  const T = useTranslations("Common");
  const router = useRouter();
  const { data: products } = useMartProducts();
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const { data: userInfo } = useFetchUserInfo();
  const [payOpen, setPayOpen] = useState<boolean>(false);
  const [skuOpen, setSkuOpen] = useState<boolean>(false);

  const [skuInfo, setSkuInfo] = useState<IProduct>();
  const [productInfo, setProductInfo] = useState<IProduct>();

  const selectedSize = useRef<string>();

  async function handleOpenPayDialog(item: IProduct) {
    setProductInfo(
      selectedSize
        ? {
            ...item,
            skuOfUserCheck: {
              selectedSize: selectedSize.current || "",
            },
          }
        : item,
    );
    setPayOpen(true);
    selectedSize.current = undefined;
  }

  function handleCart(item: IProduct) {
    if (!userInfo?.shipping) {
      setGlobalMessage({
        type: "warning",
        message: T("ShippingAddressRequired"),
      });
      router.push("/mart/shipping");
      return;
    }

    if (item.skuAttr) {
      setSkuInfo(item);
      setSkuOpen(true);
      return;
    }

    handleOpenPayDialog(item);
  }

  function handleSkuConfirm(item: IProduct, size: string) {
    setSkuOpen(false);
    selectedSize.current = size;

    handleOpenPayDialog(item);
  }

  const productClass = "flex-1 sm:flex-auto sm:w-[240px] sm:w-[250px]";

  return (
    <>
      <div className="pd-[100px] sm:pd-0 sm:trans-scroll-bar content-w-540 mt-6 flex h-fit flex-wrap gap-x-[10px] gap-y-[15px] align-top focus-visible:outline-none sm:gap-x-[10px] sm:gap-y-5 md:mr-1 md:max-h-[calc(100%-40px)] md:overflow-y-auto md:pr-2">
        {!products?.length && (
          <div className="flex h-[80vh] w-full items-center justify-center">
            <div className="text-2xl font-medium"></div>
          </div>
        )}
        {(products || []).map((item) => (
          <ProductCard
            key={item.product_id}
            item={item}
            onAddToCart={handleCart}
            className={productClass}
          />
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
        productInfo={productInfo!}
      />
    </>
  );
}
