"use client";

import "@solana/wallet-adapter-react-ui/styles.css";
import { GoBackTo } from "@/components/go-back-to";
import { BreadCrumbs } from "@/components/bread-crumbs";
import Point from "./point";

export default function MemberInfo() {
  return (
    <div className="content-w-608 relative mt-[20px]">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <Point />
    </div>
  );
}
