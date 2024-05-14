"use client";
import { NickName } from "./nick-name";
import { WalletArray } from "./wallet";
import { SocialMedia } from "./social-media";
import { ShippingAddress } from "./shipping-address";
import { useAccount } from "wagmi";
import { useAtomValue } from "jotai/react";
import { UserInfoAtom, UuidAtom } from "@/lib/state";
import { useLang } from "@/lib/use-lang";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@mysten/dapp-kit/dist/index.css";
import { useMemo } from "react";

export default function MemberInfo() {
  const { address } = useAccount();
  const uuid = useAtomValue(UuidAtom);
  const userInfo = useAtomValue(UserInfoAtom);
  const { isEn } = useLang();

  const memberInfoTpl = useMemo(() => {
    return (
      <div className="flex flex-col">
        <div className="mb-1 text-xl leading-[30px] text-white">
          {isEn ? "Membership No." : "会员编号"}
        </div>
        <div className="h-[60px] text-[40px] leading-[60px] text-[#d6d6d6]">
          #{userInfo?.membership_no}
        </div>
      </div>
    );
  }, [userInfo?.membership_no, isEn]);

  const nickNameTpl = useMemo(() => {
    return (
      <div className="flex w-full flex-col md:w-auto">
        <div className="mb-1 text-xl leading-[30px] text-white">
          {isEn ? "Nick Name" : "昵称"}
        </div>
        <NickName nickName={userInfo?.nick_name || ""} />
      </div>
    );
  }, [isEn, userInfo?.nick_name]);

  const windFallTpl = useMemo(() => {
    return (
      <div className="flex flex-col">
        <div className="mb-1 text-xl leading-[30px] text-white">
          {isEn ? "Windfalls" : "风落"}
        </div>
        <div className="flex items-center text-[40px] leading-[60px] text-[#d6d6d6]">
          <div className="text-[#1FEFA3]">
            {userInfo?.passed_windfalls || 0}
          </div>
          <div>/</div>
          <div>{userInfo?.total_windfalls || 0}</div>
        </div>
      </div>
    );
  }, [isEn, userInfo?.passed_windfalls, userInfo?.total_windfalls]);

  return (
    <>
      <div className="top-content active !rounded-none !bg-transparent !backdrop-blur-none">
        {!!(address && uuid) && (
          <div className="content-inner-box trans-scroll-bar !justify-start overflow-y-scroll !py-0 !pl-0 !pr-2">
            <div className="flex flex-col justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:flex-row md:rounded-[1.3em] md:p-[1.4em]">
              <div className="hidden items-center space-x-[75px] md:flex">
                {memberInfoTpl}
                {nickNameTpl}
              </div>

              <div className="flex w-full items-center md:hidden">
                {nickNameTpl}
              </div>

              <div className="hidden md:block">{windFallTpl}</div>

              <div className="mt-5 flex items-center justify-between md:hidden">
                {memberInfoTpl}
                {windFallTpl}
              </div>
            </div>

            <WalletArray />
            <SocialMedia />
            <ShippingAddress />
          </div>
        )}
      </div>
    </>
  );
}
