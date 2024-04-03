"use client";

import { useEffect, useState } from "react";
import { NickName } from "./nick-name";
import { ChangeLang } from "./change-lang";
import { WalletArray } from "./wallet";
import { SocialMedia } from "./social-media";
import { ShippingAddress } from "./shipping-address";
import SignDialog from "@/components/sign-dialog";
import { useAccount } from "wagmi";
import { useAtomValue } from "jotai/react";
import { UserInfoAtom, UuidAtom } from "@/lib/state";
import { useLang } from "@/lib/use-lang";

export default function Club() {
  const { address } = useAccount();
  const uuid = useAtomValue(UuidAtom);
  const userInfo = useAtomValue(UserInfoAtom);
  const { isEn } = useLang();

  const [dialogOpen, setOpen] = useState(false);

  const [walletArray, setWalletArray] = useState<any[]>([]);

  useEffect(() => {
    const wallets = Object.entries(userInfo?.wallets || {}).map((w: any) => ({
      name: w[0],
      address: w[1],
      isSign: true,
    }));

    setWalletArray([...wallets, ...walletArray]);
  }, [userInfo?.wallets]);

  return (
    <>
      <SignDialog dialogOpen={dialogOpen} setDialogOpen={setOpen} />
      {!!(address && uuid) && (
        <div className="content-inner-box active h-[96vh] !justify-start overflow-y-scroll">
          <div className="flex justify-between">
            <div className="flex items-center space-x-[75px]">
              <div className="flex flex-col">
                <div className="mb-1 text-xl leading-[30px] text-white">
                  {isEn ? "Membership No." : "会员编号"}
                </div>
                <div className="h-[60px] text-[40px] leading-[60px] text-[#d6d6d6]">
                  #{userInfo?.membership_no}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-1 text-xl leading-[30px] text-white">
                  {isEn ? "Nick Name" : "昵称"}
                </div>
                <NickName nickName={userInfo?.nick_name || ""} />
              </div>
            </div>

            <div className="flex items-start">
              <ChangeLang />
            </div>
          </div>

          <WalletArray wArr={walletArray} setWArr={setWalletArray} />

          <SocialMedia />
          <ShippingAddress />
        </div>
      )}
    </>
  );
}
