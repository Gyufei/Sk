"use client";
import { WalletArray } from "./wallets/wallet-array";
import { SocialMedia } from "./social-media";

import "@solana/wallet-adapter-react-ui/styles.css";
import { GoBackTo } from "@/components/go-back-to";
import { Exchanges } from "./exchanges";

export default function MemberInfo() {
  return (
    <div className="no-scroll-bar relative w-full h-full overflow-y-auto">
      <div className="relative flex items-center justify-end">
        <GoBackTo />
      </div>
      <WalletArray />
      <Exchanges />
      <SocialMedia />
    </div>
  );
}
