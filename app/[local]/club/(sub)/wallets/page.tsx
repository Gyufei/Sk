"use client";
import { WalletArray } from "./wallets/wallet-array";

import "@solana/wallet-adapter-react-ui/styles.css";
import { GoBackTo } from "@/components/go-back-to";
import { Exchanges } from "./exchanges";
import { BreadCrumbs } from "@/components/bread-crumbs";

export default function MemberInfo() {
  return (
    <div className="no-scroll-bar relative content-w-800 md:trans-scroll-bar md:h-fit md:max-h-[calc(100%-70px)] lg:-ml-[200px] overflow-y-auto">
      <div className="relative flex flex-row-reverse sm:flex-row items-end justify-between">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <WalletArray />
      <Exchanges />
    </div>
  );
}
