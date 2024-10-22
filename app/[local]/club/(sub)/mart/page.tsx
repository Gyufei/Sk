"use client";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { useEffect, useState } from "react";
import { formatNum } from "@/lib/utils/number";
import { ApiHost } from "@/lib/api/path";
import fetcher from "@/lib/api/fetcher";

interface Product {
  product_id: string;
  product_display_picture: string;
  product_name: string;
  product_price: number;
}

export default function MartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await fetcher(`${ApiHost}/static/products.json`);
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="relative">
      <div className="relative flex items-center md:justify-end">
        <GoBackTo />
      </div>
      <div className="trans-scroll-bar  content-w-540 mt-6 flex h-[calc(100%-100px)] flex-wrap gap-x-[10px] gap-y-5 overflow-y-auto md:pr-3">
        {products.map((item, index) => (
          <div
            key={item.product_id}
            className="content-w-250 content-w-165 box-border flex  cursor-pointer justify-center rounded-[20px] border border-transparent hover:border-white md:p-[5px]"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <div className="content-w-240 content-w-165  flex flex-col rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md">
              <Image
                src={item.product_display_picture || "/images/590.png"}
                width={240}
                height={240}
                alt="mart"
                className="content-w-165 content-h-165 rounded-[20px] "
              ></Image>
              <div
                className="p-[15px]"
                style={{
                  color: hoverIndex === index ? "white" : "#d6d6d6",
                }}
              >
                <div className="break-words text-base font-medium leading-6">
                  {item.product_name}
                </div>
                <div className="mt-5 flex justify-between">
                  <div>
                    <span className="text-base leading-6">$</span>
                    <span className="text-2xl leading-9">
                      {formatNum(String(item.product_price).replace("$", ""))}
                    </span>
                  </div>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        hoverIndex === index
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(214, 214, 214, 0.1)",
                    }}
                  >
                    <Image
                      src={
                        hoverIndex === index
                          ? "/icons/buy-car.svg"
                          : "/icons/buy-car-gray.svg"
                      }
                      width={18}
                      height={18}
                      alt="buy-car"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
