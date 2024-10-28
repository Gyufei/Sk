import useSWR from "swr";
import { ApiHost } from "./path";
import fetcher from "./fetcher";

export interface IProduct {
  product_id: string;
  product_display_picture: string;
  product_name: string;
  product_price: number;
}

export function useMartProducts() {
  const res = useSWR<Array<IProduct>>(
    `${ApiHost}/static/products.json`,
    fetcher,
  );

  return res;
}
