import Image from "next/image";
import {
  IProduct,
  checkIsBeforeSale,
  checkIsOnSale,
} from "@/lib/api/use-mart-products";
import { formatNum } from "@/lib/utils/number";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/utils";
import { useContext, useEffect, useState } from "react";
import { GlobalMsgContext } from "@/components/global-msg-context";

interface ProductCardProps {
  item: IProduct;
  onAddToCart: (item: IProduct) => void;
  className?: string;
}

export default function ProductCard({
  item,
  onAddToCart,
  className,
}: ProductCardProps) {
  const T = useTranslations("Common");
  const [isOnSale, setIsOnSale] = useState(checkIsOnSale(item));
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  function handleAddCart() {
    if (!checkIsOnSale(item)) {
      setGlobalMessage({
        type: "warning",
        message: T("ProductNotOnSale"),
      });
      return;
    }

    onAddToCart(item);
  }

  useEffect(() => {
    const checkSaleStatus = () => {
      const onSale = checkIsOnSale(item);
      setIsOnSale(onSale);
    };

    checkSaleStatus();

    const isBeforeSale = checkIsBeforeSale(item);

    // 如果商品未开始销售或正在销售中，设置定时器
    if (isBeforeSale || (item.sell_end_at && isOnSale)) {
      const timer = setInterval(checkSaleStatus, 1000); // 每秒检查一次
      return () => clearInterval(timer);
    }
  }, [item, isOnSale]);

  return (
    <div
      key={item.product_id}
      className={cn(
        className,
        "group box-border flex h-fit cursor-pointer justify-center rounded-[20px] border border-transparent hover:border-white sm:rounded-[24px] sm:p-[5px]",
      )}
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
          <div className="h-[1.25rem] align-middle text-[12px] leading-[20px] text-[#b6b6b6]">
            {item.product_id ===
            "7cf00f4d262da76a934faf6be8995e74322f32f24aa6f9b309596c861a40505e"
              ? T("OneMonthMembership")
              : ""}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-[4px] text-[14px] leading-[30px] sm:text-base sm:leading-6">
                $
              </span>
              <span className="text-[20px] font-medium leading-[30px] sm:text-2xl sm:leading-9">
                {formatNum(String(item.product_price).replace("$", ""))}
              </span>
            </div>
            <div
              onClick={handleAddCart}
              data-disabled={!isOnSale}
              className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[rgba(214,214,214,0.1)] group-hover:bg-[rgba(255,255,255,0.1)] data-[disabled=true]:opacity-50 sm:h-8 sm:w-8"
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
  );
}
