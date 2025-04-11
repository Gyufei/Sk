"use client";
import Image from "next/image";
import { useRouter } from "@/app/navigation";
import { getHost } from "@/lib/utils/browser";

export default function LocalePage() {
  const router = useRouter();

  function onClickJuu17() {
    if (getHost().includes("localhost") || getHost().includes("preview")) {
      router.push("/one");
    } else {
      window.location.href = "https://one.juu17.com";
    }
  }

  function onClickJuu17Brands() {
    if (getHost().includes("localhost") || getHost().includes("preview")) {
      router.push("/brands");
    } else {
      window.location.href = "https://brands.juu17.com";
    }
  }

  return (
    <div className="content-w-400 flex sm:justify-between justify-center gap-4 sm:gap-auto">
      <div
        className="flex h-[170px] w-[170px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur hover:bg-[rgba(255,255,255,0.3)]"
        onClick={onClickJuu17}
      >
        <Image src="/icons/logo.svg" alt="Juu17" width={80} height={80} />
        <span className="text-[17px] font-bold leading-6">Juu17</span>
      </div>
      <div
        onClick={onClickJuu17Brands}
        className="flex h-[170px] w-[170px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur hover:bg-[rgba(255,255,255,0.3)]"
      >
        <Image src="/icons/logo.svg" alt="Juu17" width={80} height={80} />
        <span className="text-[17px] font-bold leading-6">Juu17 Brands</span>
      </div>
    </div>
  );
}
