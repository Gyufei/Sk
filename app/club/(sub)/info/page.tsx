"use client";
import { WalletArray } from "./wallet-array";
import { SocialMedia } from "./social-media";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@mysten/dapp-kit/dist/index.css";
import { GoBackTo } from "@/components/go-back-to";
import { Exchanges } from "./exchanges";

export default function MemberInfo() {
  return (
    <div className="no-scroll-bar absolute mb-[100px] h-full overflow-y-auto md:-left-[calc(50%+80px)]">
      <div className="relative flex items-center justify-end">
        <GoBackTo />
      </div>
      <WalletArray />
      <Exchanges />
      <SocialMedia />
    </div>
  );
}
