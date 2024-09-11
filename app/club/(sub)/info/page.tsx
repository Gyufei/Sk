"use client";
import { WalletArray } from "./wallet";
import { SocialMedia } from "./social-media";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function MemberInfo() {
  return (
    <>
      <WalletArray />
      <SocialMedia />
    </>
  );
}
