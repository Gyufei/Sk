import useSWR from "swr";
import { ApiHost } from "./path";
import fetcher from "./fetcher";

export interface IProduct {
  product_id: string;
  product_display_picture: string;
  product_name: string;
  product_price: number;
  skuAttr?: {
    name: string;
    value: string;
  }[];
  skuImage?: string;
}

const url = `${ApiHost}/static/products.json?t=${new Date().getTime()}`;

export function useMartProducts() {
  const res = useSWR<Array<IProduct>>(
    url,
    fetcher,
  );

  return res;
}
