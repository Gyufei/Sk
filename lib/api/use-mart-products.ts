import useSWR from "swr";
import { ApiHost } from "./path";
import fetcher from "./fetcher";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./state";

export interface IProduct {
  product_id: string;
  product_display_picture: string;
  product_name: string;
  product_price: number;
  skuAttr?: [
    {
      skuName: string;
      skuValue: [
        {
          name: string;
          value: string;
        },
      ];
    },
  ];
  skuImage?: string;
  skuOfUserCheck?: Record<string, string>;
  sell_start_at: number;
  sell_end_at: number;
}

export function useMartProducts() {
  const uuid = useAtomValue(UuidAtom);

  async function productFetcher() {
    if (!uuid) return [];

    const url = `${ApiHost}/order/products?user_id=${uuid}`;
    const res = await fetcher(url);

    const products = res || [];

    const productsNotEndSale = products.filter((product: IProduct) => {
      if (checkIsAfterSale(product)) return false;
      return true;
    });

    return productsNotEndSale;
  }

  const res = useSWR<Array<IProduct>>("products", productFetcher);

  return res;
}

export function checkIsBeforeSale(product: IProduct) {
  if (!product.sell_start_at) return false;

  const now = Math.floor(new Date().getTime() / 1000);
  if (now < product.sell_start_at) return true;
  return false;
}

export function checkIsAfterSale(product: IProduct) {
  if (!product.sell_end_at) return false;

  const now = Math.floor(new Date().getTime() / 1000);
  if (now > product.sell_end_at) return true;
  return false;
}

export function checkIsOnSale(product: IProduct) {
  if (!product.sell_start_at || !product.sell_end_at) return true;

  if (checkIsBeforeSale(product)) return false;
  if (checkIsAfterSale(product)) return false;
  return true;
}
