"use client";

import "@solana/wallet-adapter-react-ui/styles.css";
import { GoBackTo } from "@/components/go-back-to";
import { SocialMediaContent } from "./social-media-content";
import { BreadCrumbs } from "@/components/bread-crumbs";

export default function MemberInfo() {
  return (
    <div className="content-w-800 relative lg:-ml-[200px]">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <SocialMediaContent />
    </div>
  );
}
