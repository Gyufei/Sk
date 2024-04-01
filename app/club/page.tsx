"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { NickName } from "./nick-name";
import { ChangeLang } from "./change-lang";
import { WalletArray } from "./wallet";
import { SocialMedia } from "./social-media";

export default function Club() {
  const memNo = 19;
  const [nickName, setNickName] = useState("wodddd");
  const [currentLang, setCurrentLang] = useState<"En" | "Cn">("En");

  const [walletArray, setWalletArray] = useState([
    {
      name: "OP Mainnet",
      address: "0xe3b7312b4cBb0031C4288657062D5A5e882B37c6",
      isSign: true,
    },
    {
      name: "BNB Mainnet",
      address: "0xe3b7312b4cBb0031C4288657062D5A5e882B37c6",
      isSign: true,
    },
  ]);

  return (
    <div className="content-inner-box active">
      <div className="flex justify-between">
        <div className="flex items-center space-x-[75px]">
          <div className="flex flex-col">
            <div className="mb-1 text-xl leading-[30px] text-white">
              Membership No.
            </div>
            <div className="text-[40px] leading-[60px] text-[#d6d6d6]">
              #{memNo}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-1 text-xl leading-[30px] text-white">
              Nick Name
            </div>
            <NickName nickName={nickName} setNickName={setNickName} />
          </div>
        </div>

        <div className="flex items-start">
          <ChangeLang lang={currentLang} setLang={setCurrentLang} />
        </div>
      </div>

      <WalletArray wArr={walletArray} setWArr={setWalletArray} />

      <SocialMedia />
    </div>
  );
}
