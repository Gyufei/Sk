import useSWR from "swr";
import { ApiHost } from "./path";
import fetcher from "./fetcher";

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

const url = `${ApiHost}/static/products.json?t=${new Date().getTime()}`;

export function useMartProducts() {
  const res = useSWR<Array<IProduct>>(url, fetcher);

  return res;
}

export function checkIsOnSale(product: IProduct) {
  if (!product.sell_start_at || !product.sell_end_at) return true;

  const now = Math.floor(new Date().getTime() / 1000);
  if (now < product.sell_start_at || now > product.sell_end_at) return false;

  return true;
}
