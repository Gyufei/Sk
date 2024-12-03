"use client";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletArray } from "./wallets-array";
import { GoBackTo } from "@/components/go-back-to";
import { Exchanges } from "./exchanges";
import { BreadCrumbs } from "@/components/bread-crumbs";

export default function MemberInfo() {
  return (
    <div className="no-scroll-bar content-w-800 md:trans-scroll-bar relative overflow-y-auto md:h-fit md:max-h-[calc(100%-70px)]">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <WalletArray />
      <Exchanges />
    </div>
  );
}
