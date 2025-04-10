"use client";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletArray } from "./wallets-array";
import { Exchanges } from "./exchanges";

export default function MemberInfo() {
  return (
    <div className="no-scroll-bar content-w-800 md:trans-scroll-bar relative overflow-y-auto focus-visible:outline-none md:h-fit md:max-h-[calc(100%-70px)]">
      <WalletArray />
      <Exchanges />
    </div>
  );
}
