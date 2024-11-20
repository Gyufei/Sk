"use client";

import "@solana/wallet-adapter-react-ui/styles.css";
import { GoBackTo } from "@/components/go-back-to";
import { SocialMedia } from "./social-media";
import { BreadCrumbs } from "@/components/bread-crumbs";

export default function MemberInfo() {
  return (
    <div className="no-scroll-bar relative content-w-800 lg:-ml-[200px] md:-ml-[250px] overflow-y-auto">
      <div className="relative flex flex-row-reverse sm:flex-row items-end justify-between">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <SocialMedia />
    </div>
  );
}
